function getSystemFonts_func() {
  var a = systemFontList.length;
  var c = "";
  for (var b = 0; b < a; b++) {
    c = c + systemFontList[b] + ", ";
  }
  document.getElementById("fontList").innerHTML = c;
  var d = document.getElementById("fontListSWF");
  var e = d.getValue();
}
function populateFontList(b) {
  var e = 0;
  var g = 0;
  var a = "<ul>";
  var d = a;
  for (var c in b) {
    var f = b[c];
    f = f.replace(/^\s\s*/, "").replace(/\s\s*$/, "");
    if (
      f.match(/[_\-\s]Italic$/) ||
      f.match(/[_\-\s](Demi)?[Bb]old$/) ||
      f.match(/[_\-\s]Medium$/) ||
      f.match(/[_\-\s](Ultra)?[Ll]ight$/) ||
      f.match(/[_\-\s]Condensed$/)
    ) {
      a += '<li style="color:#aaa;">' + f + "</li>";
      systemFontList.push(f);
    } else {
      a += "<li>" + f + "</li>";
      f = f.replace(/\s*Regular$/, "");
      d += "<li>" + f + "</li>";
      systemFontList.push(f);
      g++;
    }
    e++;
  }
  d += "</ul>";
  a += "</ul>";
  a = e + " fonts altogether:" + a;
  d = g + ' "regular" fonts:' + d;
}