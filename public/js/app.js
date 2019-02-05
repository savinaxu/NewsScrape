$(function() {
    $(".scrape").on("click", function() {
        $.ajax({
            method: "GET",
            url: "/scrape"
        })
          window.location.replace("/scrape");
    })
})