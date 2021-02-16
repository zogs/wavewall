const rp = require('request-promise')
const cheerio = require('cheerio');


exports.getSurfometer = async function(url) {

  let html = await rp(url);
  $ = cheerio.load(html);
  // rewrite source image to absolute url
  $("img").each(function() {
        let old = $(this).attr("src");
        let src = "https://www.yadusurf.com/" + old;
        $(this).attr("src", src);
        $(this).attr('width','');
        $(this).attr('height','');
  });
  // remove inlien width & height
  $("*").each(function() {
    $(this).attr('style','');
  })
  let div = $('#Surfometer');
  div.attr('id', null);
  div.attr('onmousemove', null);
  return div.html();

}


exports.getSpotsList = async function(provider = 'https://www.yadusurf.com') {
  const list = [];

  let html = await rp(provider);
  $ = cheerio.load(html);

  $('#spotsListsContainer ul').each(function() {
    let ul = $(this);
    let sublist = {region: ul.attr('name'), spots: []};
    ul.find('li').each(function() {
      let li = $(this);
      sublist.spots.push({
        name: li.attr('name'),
        fid: li.attr('fid'),
        nameforurl: li.attr('nameforurl'),
        city: li.attr('city'),
        lat: li.attr('lat'),
        lon: li.attr('lon'),
      })
    })
    list.push(sublist);
  })

  return list;
}