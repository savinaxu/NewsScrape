$(function() {
    $(".scrape").on("click", function() {
        $.ajax({
            method: "GET",
            url: "/scrape"
        })
          window.location.replace("/scrape");
    })

    $(".save-article").on("click", function() {
        let articleId = $(this).attr("data-id")
        let data = {}
        $(this).hide()

        data.title = $("#title-" + articleId).text()
        data.link = $("#link-" + articleId).text()
        data.img = $("#img-" + articleId).attr('src')

        $.ajax({
            method: "POST",
            dataType: "json",
            url: "/api/save",
            data: data
        })
    })

    $(".delete-article").on("click", function() {
        let deleteId = $(this).attr("data-id")
        $.ajax({
            method: "DELETE",
            url: "/save/" + deleteId
        }).then(function(data) {
            location.reload()
        })
    })

    $(".note-article").on("click", function() {
        let noteId = $(this).attr("data-id")
        $.ajax({
            method: "GET",
            url: "/note/" + noteId
        })
        window.location.replace("/note/" + noteId);
    })

})