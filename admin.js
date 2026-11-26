const $ = selector => document.querySelector(selector);
const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
let products = [];
let designs = [];
let showrooms = [];
let enquiries = [];
let editing = null;
let cmsDraft = null;
let contentSection = "settings";
let toastTimer;

async function request(url, options = {}) {
  const response = await fetch(url, {
    credentials: "same-origin",
    ...options,
    headers: { ...(options.body ? { "Content-Type": "application/json" } : {}), ...options.headers }
  });
  const result = response.status === 204 ? null : await response.json();
  if (!response.ok) throw new Error(result?.error || `Request failed (${response.status}).`);
  return result;
}

function toast(message) {
  const element = $("#toast");
  element.textContent = message;
  element.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => element.classList.remove("visible"), 3200);
}

function setView(view) {
  document.querySelectorAll(".nav-link").forEach(button => button.classList.toggle("active", button.dataset.view === view));
  document.querySelectorAll(".view").forEach(section => section.classList.toggle("active", section.id === `view-${view}`));
  if (view === "enquiries") loadData().catch(error => toast(error.message));
}

function empty(message) {
  return `<div class="empty-state">${esc(message)}</div>`;
}

function table(headers, rows, message) {
  if (!rows.length) return empty(message);
  return `<table class="data-table"><thead><tr>${headers.map(header => `<th>${esc(header)}</th>`).join("")}</tr></thead><tbody>${rows}</tbody></table>`;
}

function productRows(items) {
  return items.map(item => `<tr>
    <td><div class="item-cell">${item.image ? `<img class="item-thumb" src="${esc(item.image)}" alt="">` : `<span class="item-thumb"></span>`}<span><span class="item-title">${esc(item.name)}</span><small class="item-subtitle">${esc(item.category)} · ${esc(item.metal)} ${esc(item.purity)}${item.metal === "Gold" ? "K" : "%"} · ${esc(item.weight)} g</small></span></div></td>
    <td>${esc(item.stone)}</td><td>${item.featured ? "Featured" : "Standard"}</td>
    <td><div class="row-actions"><button data-edit="product" data-id="${esc(item.id)}">Edit</button><button class="delete" data-delete="product" data-id="${esc(item.id)}">Delete</button></div></td>
  </tr>`).join("");
}

function showroomRows(items) {
  return items.map(item => `<tr>
    <td><div class="item-cell">${item.image ? `<img class="item-thumb" src="${esc(item.image)}" alt="">` : `<span class="item-thumb"></span>`}<span><span class="item-title">${esc(item.name)}</span><small class="item-subtitle">${esc(item.address)}</small></span></div></td>
    <td>${esc(item.hours)}</td><td>${esc(item.phone || "—")}</td>
    <td><div class="row-actions"><button data-edit="showroom" data-id="${esc(item.id)}">Edit</button><button class="delete" data-delete="showroom" data-id="${esc(item.id)}">Delete</button></div></td>
  </tr>`).join("");
}

function designRows(items) {
  return items.map(item => `<tr>
    <td><div class="item-cell"><img class="item-thumb" src="${esc(item.image)}" alt=""><span><span class="item-title">${esc(item.name)}</span><small class="item-subtitle">${esc(item.category)}</small></span></div></td>
    <td>${esc(item.image)}</td><td><div class="row-actions"><button data-edit="design" data-id="${esc(item.id)}">Edit</button><button class="delete" data-delete="design" data-id="${esc(item.id)}">Delete</button></div></td>
  </tr>`).join("");
}

function enquiryRows(items, limit) {
  return items.slice(0, limit || items.length).map(item => {
    const when = new Date(item.createdAt);
    const formatted = Number.isNaN(when.valueOf()) ? "—" : when.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
    const status = String(item.status || "New").toLowerCase();
    return `<tr>
      <td><span class="item-title">${esc(item.name)}</span><small class="item-subtitle">${esc(item.email || item.phone)}</small></td>
      <td>${esc(item.department)}${item.product ? `<small class="item-subtitle">${esc(item.product)}</small>` : ""}</td>
      <td>${esc(item.message || item.visitDate || "—")}</td>
      <td>${esc(formatted)}</td>
      <td>${limit ? `<span class="status status-${esc(status)}">${esc(item.status)}</span>` : `<select class="status-select" data-status-id="${esc(item.id)}"><option ${item.status === "New" ? "selected" : ""}>New</option><option ${item.status === "Contacted" ? "selected" : ""}>Contacted</option><option ${item.status === "Resolved" ? "selected" : ""}>Resolved</option></select>`}</td>
      ${limit ? "" : `<td><div class="row-actions"><a href="tel:${esc(item.phone)}">Call</a><button class="delete" data-delete="enquiry" data-id="${esc(item.id)}">Delete</button></div></td>`}
    </tr>`;
  }).join("");
}

function render() {
  $("#product-nav-count").textContent = products.length;
  $("#design-nav-count").textContent = designs.length;
  $("#showroom-nav-count").textContent = showrooms.length;
  $("#enquiry-nav-count").textContent = enquiries.filter(item => item.status === "New").length;
  $("#stat-products").textContent = products.length;
  $("#stat-showrooms").textContent = showrooms.length;
  $("#stat-new-enquiries").textContent = enquiries.filter(item => item.status === "New").length;
  $("#products-table").innerHTML = table(["DESIGN", "STONE", "WEBSITE DISPLAY", "ACTIONS"], productRows(products), "No collection pieces yet.");
  $("#designs-table").innerHTML = table(["EDITORIAL DESIGN", "IMAGE", "ACTIONS"], designRows(designs), "No additional design cards yet.");
  $("#showrooms-table").innerHTML = table(["LOCATION", "OPENING HOURS", "PHONE", "ACTIONS"], showroomRows(showrooms), "No showrooms added yet.");
  $("#enquiries-table").innerHTML = table(["CUSTOMER", "ENQUIRY", "MESSAGE / VISIT", "RECEIVED", "STATUS", "ACTIONS"], enquiryRows(enquiries), "No customer enquiries yet.");
  $("#recent-enquiries").innerHTML = table(["CUSTOMER", "ENQUIRY", "MESSAGE", "RECEIVED", "STATUS"], enquiryRows(enquiries, 5), "New enquiries from the website will appear here.");
  if (cmsDraft) renderContentEditor();
}

async function loadData() {
  const [productList, designList, showroomList, enquiryList, content] = await Promise.all([
    request("/api/admin/products"), request("/api/admin/designs"), request("/api/admin/showrooms"),
    request("/api/admin/enquiries"), request("/api/admin/content")
  ]);
  products = productList;
  designs = designList;
  showrooms = showroomList;
  enquiries = enquiryList;
  cmsDraft = content;
  render();
}

function input(name, label, value = "", type = "text", required = true, wide = false) {
  return `<label class="${wide ? "wide" : ""}">${esc(label)}<input name="${esc(name)}" type="${esc(type)}" value="${esc(value)}" ${required ? "required" : ""} ${type === "number" ? 'step="any"' : ""}></label>`;
}

function select(name, label, value, options, wide = false) {
  return `<label class="${wide ? "wide" : ""}">${esc(label)}<select name="${esc(name)}" required>${options.map(option => `<option ${option === value ? "selected" : ""}>${esc(option)}</option>`).join("")}</select></label>`;
}

function openDialog(kind, item) {
  editing = { kind, id: item?.id || null };
  $("#dialog-eyebrow").textContent = item ? `UPDATE ${kind.toUpperCase()}` : `ADD TO ${kind.toUpperCase()}`;
  $("#dialog-title").textContent = kind === "product"
    ? (item ? "Edit collection piece" : "New collection piece")
    : kind === "design"
      ? (item ? "Edit editorial design" : "New editorial design")
      : (item ? "Edit showroom details" : "New showroom");
  $("#dialog-error").textContent = "";
  if (kind === "product") {
    $("#record-fields").innerHTML = `${input("name", "Design name", item?.name || "")}${input("category", "Category", item?.category || "")}${select("metal", "Metal", item?.metal || "Gold", ["Gold", "Silver", "Platinum"])}${input("purity", "Purity (karat / %)", item?.purity ?? 22, "number")}${input("weight", "Weight (grams)", item?.weight ?? 1, "number")}${input("stone", "Stone", item?.stone || "None")}${input("image", "Image path or HTTPS URL", item?.image || "", "text", false, true)}<label class="checkbox-field wide"><input name="featured" type="checkbox" ${item?.featured ? "checked" : ""}> Show in the homepage collection</label>`;
  } else if (kind === "design") {
    $("#record-fields").innerHTML = `${input("name", "Design name", item?.name || "")}${input("category", "Category", item?.category || "")}${input("image", "Image path or HTTPS URL", item?.image || "", "text", true, true)}`;
  } else {
    $("#record-fields").innerHTML = `${input("name", "Showroom name", item?.name || "")}${input("phone", "Phone number", item?.phone || "", "tel", false)}${input("address", "Full address", item?.address || "", "text", true, true)}${input("hours", "Opening hours", item?.hours || "", "text", true, true)}${input("rating", "Rating / reviews", item?.rating || "", "text", false)}${input("image", "Image path or HTTPS URL", item?.image || "", "text", false, true)}`;
  }
  $("#record-dialog").showModal();
}

function formValues(form) {
  const values = Object.fromEntries(new FormData(form).entries());
  if (form.elements.featured) values.featured = form.elements.featured.checked;
  return values;
}

function cmsField(path, label, value, multiline = false, wide = false) {
  const control = multiline
    ? `<textarea data-cms-path="${esc(path)}" rows="4">${esc(value)}</textarea>`
    : `<input data-cms-path="${esc(path)}" value="${esc(value)}">`;
  return `<label class="content-field${wide ? " wide" : ""}">${esc(label)}${control}</label>`;
}

function cmsLinesField(path, label, values = []) {
  return `<label class="content-field wide">${esc(label)}<textarea data-cms-lines-path="${esc(path)}" rows="5">${esc(values.join("\n"))}</textarea><small>One paragraph per line.</small></label>`;
}

function cmsGroup(title, description, fields) {
  return `<section class="cms-group"><div class="cms-group-heading"><h2>${esc(title)}</h2><p>${esc(description)}</p></div><div class="cms-fields">${fields}</div></section>`;
}

function cmsRepeater(path, title, rows, fields, stringRows = false) {
  const cards = rows.map((row, index) => {
    const body = stringRows
      ? cmsField(`${path}.${index}`, `Paragraph ${index + 1}`, row, true, true)
      : fields.map(([key, label, multiline, lineList]) => lineList
        ? cmsLinesField(`${path}.${index}.${key}`, label, row[key])
        : cmsField(`${path}.${index}.${key}`, label, row[key], multiline, multiline)).join("");
    return `<article class="cms-entry"><div class="cms-entry-title"><strong>${esc(title)} ${index + 1}</strong><button class="delete-link" type="button" data-remove-cms="${esc(path)}" data-index="${index}">Remove</button></div><div class="cms-fields">${body}</div></article>`;
  }).join("");
  return `<section class="cms-group cms-repeater"><div class="cms-group-heading"><h2>${esc(title)}</h2><p>Edit, add or remove these website items.</p></div>${cards || `<p class="empty-state">No items yet.</p>`}<button class="button button-quiet" type="button" data-add-cms="${esc(path)}">＋ Add ${esc(title.toLowerCase().replace(/s$/, ""))}</button></section>`;
}

function renderContentEditor() {
  if (!cmsDraft) return;
  document.querySelectorAll(".content-tab").forEach(button => button.classList.toggle("active", button.dataset.contentSection === contentSection));
  const data = cmsDraft;
  let html = "";
  if (contentSection === "settings") {
    const s = data.settings;
    html = cmsGroup("Brand and homepage", "Change the text and images used on the homepage and browser title.", [
      cmsField("settings.siteName", "Website / brand name", s.siteName),
      cmsField("settings.tagline", "Brand tagline", s.tagline),
      cmsField("settings.description", "Search description", s.description, true, true),
      cmsField("settings.homepageHeadline", "Homepage headline", s.homepageHeadline),
      cmsField("settings.featuredTitle", "Featured products heading (line breaks allowed)", s.featuredTitle, true, true),
      cmsField("settings.heroImage", "Hero image (asset filename or HTTPS URL)", s.heroImage, false, true),
      cmsField("settings.headerLogoImage", "Header logo image", s.headerLogoImage, false, true),
      cmsField("settings.showroomBannerImage", "Showroom banner image", s.showroomBannerImage, false, true),
      cmsField("settings.yearsOfTrust", "Years of trust counter", s.yearsOfTrust),
      cmsField("settings.teamMembers", "Team members counter", s.teamMembers),
      cmsField("settings.yearsLabel", "Years counter label", s.yearsLabel),
      cmsField("settings.showroomsLabel", "Showrooms counter label", s.showroomsLabel),
      cmsField("settings.teamLabel", "Team counter label", s.teamLabel),
      cmsField("settings.chipClassics", "Hero link 1 label", s.chipClassics),
      cmsField("settings.chipPersonalized", "Hero link 2 label", s.chipPersonalized),
      cmsField("settings.chipStatement", "Hero link 3 label", s.chipStatement),
      cmsField("settings.chipFinest", "Hero link 4 label", s.chipFinest),
      cmsField("settings.homepageQuote", "Homepage quote (line breaks are kept)", s.homepageQuote, true, true),
      cmsField("settings.quoteLinkText", "Quote link label", s.quoteLinkText),
      cmsField("settings.showroomCta", "Showroom button label", s.showroomCta),
      cmsField("settings.contactTitle", "Contact page headline (line breaks allowed)", s.contactTitle, true, true),
      cmsField("settings.contactIntro", "Contact page introduction", s.contactIntro, true, true),
      cmsField("settings.storesTitle", "Showroom page heading", s.storesTitle),
      cmsField("settings.storesDescription", "Showroom page introduction", s.storesDescription, true, true),
      cmsField("settings.footerTagline", "Footer tagline", s.footerTagline),
      cmsField("settings.logoImage", "Footer logo image", s.logoImage, false, true)
    ]) + cmsGroup("Navigation and social links", "Leave a social URL blank to hide its footer icon.", [
      cmsField("settings.navHome", "Home navigation label", s.navHome),
      cmsField("settings.navAbout", "About navigation label", s.navAbout),
      cmsField("settings.navCollection", "Collection navigation label", s.navCollection),
      cmsField("settings.navContact", "Contact navigation label", s.navContact),
      cmsField("settings.socialFacebook", "Facebook HTTPS URL", s.socialFacebook, false, true),
      cmsField("settings.socialInstagram", "Instagram HTTPS URL", s.socialInstagram, false, true),
      cmsField("settings.socialLinkedin", "LinkedIn HTTPS URL", s.socialLinkedin, false, true)
    ]);
  } else if (contentSection === "about") {
    const a = data.about;
    html = cmsGroup("About page headings", "Edit the story headings and introductory copy.", [
      cmsField("about.title", "Page heading", a.title),
      cmsField("about.growthTitle", "Growth timeline heading", a.growthTitle),
      cmsField("about.journeyTitle", "Showroom stories heading", a.journeyTitle)
    ]) + cmsRepeater("about.paragraphs", "About paragraphs", a.paragraphs, [], true)
      + cmsRepeater("about.milestones", "Growth milestones", a.milestones, [
        ["year", "Year"], ["title", "Milestone"], ["location", "Location"]
      ]) + cmsRepeater("about.stories", "Showroom stories", a.stories, [
        ["label", "Location / year"], ["title", "Story title"], ["body", "Story copy", true],
        ["image", "Image filename or HTTPS URL"], ["alt", "Image description"]
      ]);
  } else if (contentSection === "collection") {
    const c = data.collection;
    html = cmsGroup("Collection page introduction", "These fields update the editorial introduction above your jewellery designs.", [
      cmsField("collection.eyebrow", "Eyebrow", c.eyebrow),
      cmsField("collection.title", "Page title", c.title),
      cmsField("collection.subtitle", "Subtitle", c.subtitle),
      cmsField("collection.description", "Introduction", c.description, true, true),
      cmsField("collection.signoff", "Collection sign-off", c.signoff),
      cmsField("collection.browseTitle", "Browse section heading", c.browseTitle),
      cmsField("collection.browseDescription", "Browse section description", c.browseDescription, true, true),
      cmsField("collection.designsTitle", "Additional designs heading", c.designsTitle),
      cmsField("collection.designsDescription", "Additional designs description", c.designsDescription, true, true),
      cmsField("collection.priceNote", "Product price note", c.priceNote, true, true)
    ]) + cmsRepeater("collection.stories", "Editorial stories", c.stories, [
      ["name", "Category label"], ["title", "Story title"], ["cta", "Button label"],
      ["image", "Image filename or HTTPS URL"], ["alt", "Image description"],
      ["paragraphs", "Story paragraphs", false, true]
    ]);
  } else if (contentSection === "insights") {
    const a = data.insights;
    html = cmsGroup("Insights page", "Manage the article listing introduction and author attribution.", [
      cmsField("insights.title", "Page title", a.title),
      cmsField("insights.description", "Page description", a.description, true, true),
      cmsField("insights.author", "Article author / publisher", a.author)
    ]) + cmsRepeater("insights.articles", "Articles", a.articles, [
      ["id", "Article ID (lowercase, use hyphens)"], ["title", "Title"], ["category", "Category"],
      ["excerpt", "Listing summary", true], ["body", "Full article copy", true]
    ]);
  } else {
    html = cmsRepeater("policies", "Policy pages", data.policies, [
      ["id", "Policy ID (lowercase, use hyphens)"], ["title", "Policy title"], ["body", "Policy text", true]
    ]);
  }
  $("#content-fields").innerHTML = html;
}

function setContentPath(path, value) {
  const parts = path.split(".");
  const key = parts.pop();
  const parent = parts.reduce((node, part) => node[part], cmsDraft);
  parent[key] = value;
}

function newContentEntry(path) {
  const templates = {
    "about.paragraphs": "",
    "about.milestones": { year: "", title: "", location: "" },
    "about.stories": { label: "", title: "", body: "", image: "", alt: "" },
    "collection.stories": { name: "", title: "", cta: "", image: "", alt: "", paragraphs: [""] },
    "insights.articles": { id: `article-${Date.now()}`, title: "", category: "Buying Guide", excerpt: "", body: "" },
    policies: { id: `policy-${Date.now()}`, title: "", body: "" }
  };
  return Object.hasOwn(templates, path) ? structuredClone(templates[path]) : null;
}

async function saveWebsiteContent(event) {
  event.preventDefault();
  $("#content-error").textContent = "";
  try {
    cmsDraft = await request("/api/admin/content", { method: "PUT", body: JSON.stringify(cmsDraft) });
    await loadData();
    toast("Website content saved and published.");
  } catch (error) {
    $("#content-error").textContent = error.message;
  }
}

async function saveRecord(event) {
  event.preventDefault();
  if (!editing) return;
  const { kind, id } = editing;
  const resource = ({ product: "products", design: "designs", showroom: "showrooms" })[kind];
  const values = formValues(event.currentTarget);
  try {
    await request(`/api/admin/${resource}${id ? `/${encodeURIComponent(id)}` : ""}`, {
      method: id ? "PUT" : "POST", body: JSON.stringify(values)
    });
    $("#record-dialog").close();
    try {
      await loadData();
    } catch (error) {
      toast(error.message);
    }
    toast(id ? "Changes saved." : "Added to your website.");
  } catch (error) {
    $("#dialog-error").textContent = error.message;
  }
}

async function deleteRecord(resource, id) {
  const label = resource === "products" ? "collection piece" : resource === "designs" ? "design card" : resource === "showrooms" ? "showroom" : "enquiry";
  if (!window.confirm(`Permanently delete this ${label}?`)) return;
  try {
    await request(`/api/admin/${resource}/${encodeURIComponent(id)}`, { method: "DELETE" });
    await loadData();
    toast("Deleted successfully.");
  } catch (error) {
    toast(error.message);
  }
}

async function startApp(email) {
  $("#login-screen").hidden = true;
  $("#admin-app").hidden = false;
  $("#admin-email").textContent = email;
  $("#today-label").textContent = new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  await loadData();
}

function showLogin() {
  $("#admin-app").hidden = true;
  $("#login-screen").hidden = false;
}

$("#navigation").addEventListener("click", event => {
  const button = event.target.closest("[data-view]");
  if (button) setView(button.dataset.view);
});
$("#content-navigation").addEventListener("click", event => {
  const button = event.target.closest("[data-content-section]");
  if (!button) return;
  contentSection = button.dataset.contentSection;
  renderContentEditor();
});
$("#content-fields").addEventListener("input", event => {
  const field = event.target;
  if (field.dataset.cmsPath) setContentPath(field.dataset.cmsPath, field.value);
  if (field.dataset.cmsLinesPath) setContentPath(field.dataset.cmsLinesPath, field.value.split(/\r?\n/).map(line => line.trim()).filter(Boolean));
});
$("#content-fields").addEventListener("click", event => {
  const add = event.target.closest("[data-add-cms]");
  const remove = event.target.closest("[data-remove-cms]");
  if (add) {
    const list = add.dataset.addCms.split(".").reduce((value, part) => value[part], cmsDraft);
    list.push(newContentEntry(add.dataset.addCms));
    renderContentEditor();
  }
  if (remove) {
    const list = remove.dataset.removeCms.split(".").reduce((value, part) => value[part], cmsDraft);
    list.splice(Number(remove.dataset.index), 1);
    renderContentEditor();
  }
});
document.addEventListener("click", event => {
  const viewButton = event.target.closest("[data-open-view]");
  if (viewButton) setView(viewButton.dataset.openView);
  const edit = event.target.closest("[data-edit]");
  if (edit) openDialog(edit.dataset.edit, ({ product: products, design: designs, showroom: showrooms })[edit.dataset.edit].find(item => item.id === edit.dataset.id));
  const remove = event.target.closest("[data-delete]");
  if (remove) deleteRecord(({ product: "products", design: "designs", showroom: "showrooms", enquiry: "enquiries" })[remove.dataset.delete], remove.dataset.id);
});
$("#enquiries-table").addEventListener("change", async event => {
  const selectElement = event.target.closest("[data-status-id]");
  if (!selectElement) return;
  try {
    await request(`/api/admin/enquiries/${encodeURIComponent(selectElement.dataset.statusId)}`, {
      method: "PATCH", body: JSON.stringify({ status: selectElement.value })
    });
    await loadData();
    toast("Enquiry status updated.");
  } catch (error) {
    toast(error.message);
  }
});
$("#login-form").addEventListener("submit", async event => {
  event.preventDefault();
  const errorElement = $("#login-error");
  errorElement.textContent = "";
  try {
    const result = await request("/api/admin/login", { method: "POST", body: JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))) });
    await startApp(result.email);
  } catch (error) {
    errorElement.textContent = error.message;
  }
});
$("#record-form").addEventListener("submit", saveRecord);
$("#content-form").addEventListener("submit", saveWebsiteContent);
$("#add-product").addEventListener("click", () => openDialog("product"));
$("#add-design").addEventListener("click", () => openDialog("design"));
$("#add-showroom").addEventListener("click", () => openDialog("showroom"));
$("#dialog-close").addEventListener("click", () => $("#record-dialog").close());
$("#dialog-cancel").addEventListener("click", () => $("#record-dialog").close());
$("#logout-button").addEventListener("click", async () => {
  try {
    await request("/api/admin/logout", { method: "POST", body: "{}" });
    showLogin();
  } catch (error) {
    toast(error.message);
  }
});

request("/api/admin/session").then(session => startApp(session.email)).catch(showLogin);
