var tags = [];
function removeTag(a) {
  var b = a.split("%");
  b = b[1];
  var c = $.inArray(b, tags);
  if (c != -1) {
    tags.splice(c, 1);
  }
  tags.pop();
  vvConfigObj.set_taglist(tags);
  vvConfigObj.save();
  tags.push("ALL");
}
function addTagList(b) {
  var d = b.split(",");
  var a = d.length;
  for (var c = 0; c < a; c++) {
    addTag(d[c].trim());
  }
}
function addTag(a) {
  if (isNewTag(a)) {
    var b = tags.pop();
    tags.push(a);
    tags.sort();
    vvConfigObj.set_taglist(tags);
    vvConfigObj.save();
    tags.push("ALL");
  }
}
function isNewTag(a) {
  if (a != "ALL") {
    if ($.inArray(a, tags) == -1) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}
function getTags2Array() {
  var a = vvConfigObj.get_taglist();
  tags = a.split(",");
  tags.sort();
  tags.push("ALL");
}
function fillTagList() {
  var a = tags.length;
  var b = clearSelectList("songnav_tags");
  if (b) {
    var c = document.createDocumentFragment();
    var g = document.getElementById("songnav_tags");
    for (var d = 0; d < a; d++) {
      var e = document.createElement("option");
      e.innerHTML = tags[d];
      e.value = d;
      c.appendChild(e);
    }
    g.appendChild(c);
    setTag2All();
  }
}
function setTag2All() {
  var a = tags.length;
  var b = "#songnav_tags option:eq(" + (a - 1) + ")";
  $(b).prop("selected", true);
}
