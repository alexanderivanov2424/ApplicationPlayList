document.addEventListener('DOMContentLoaded', function() {
    // var checkPageButton = document.getElementById('save');
    // checkPageButton.addEventListener('click', function() {
    //         function changeColor(){
    //             document.body.style.backgroundColor = "green";
    //             window.scrollBy(0, 100);
    //         }
    //
    //         chrome.tabs.executeScript({code: '(' + changeColor + ')();'}, function(result){
    //             console.log(result);
    //         })
    //     });

    var checkPageButton = document.getElementById('next');
    checkPageButton.addEventListener('click', function() {
            function changeColor(){
                document.body.style.backgroundColor = "green";
                window.scrollBy(0, 100);
            }

            chrome.tabs.executeScript({code: '(' + changeColor + ')();'}, function(result){
                console.log(result);
            })
        });
});
