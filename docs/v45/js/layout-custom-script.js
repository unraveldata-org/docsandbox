var _eiq = _eiq || [];
 var _engagio_settings = {
   accountId: "5472413401247adb4ef0866e4acda62c86d5dd1e"
 };
 (function() {
   var ei = document.createElement('script'); ei.type = 'text/javascript'; ei.async = true;
   ei.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'web-analytics.engagio.com/js/ei.js';
   var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ei, s);
 })();


(function() {
   var dsmin = document.createElement('script'); dsmin.type = 'text/javascript'; dsmin.async = true;
   dsmin.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.js';
   var ds = document.getElementsByTagName('script')[0]; ds.parentNode.insertBefore(dsmin, ds);
 })();
 
/* this is non-functional per Mike
 docsearch({
    apiKey: 'ebe33c3b80dd3c2d160d42696a55b5cd',
    indexName: 'unraveldata',
    inputSelector: 'aa-search-input',
    debug: true, // Set debug to true if you want to inspect the dropdown
 });
  */
  
  // workaround frot trunced search box 
$(document).ready(function () {
  $('.site-sidebar .search-field').on('keyup focus', function (e) {
  var val = $(this).val();
  if (val !== '') {
  $(".site-sidebar").css("overflow-x", "inherit");
  $(".site-sidebar").css("overflow-y", "inherit");
  } else {
  $(".site-sidebar").css("overflow-x", "hidden");
  $(".site-sidebar").css("overflow-y", "auto");
  }
  });
 });