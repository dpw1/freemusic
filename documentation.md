## Adding new music

1. Go to "actuallyfreemusic"'s google drive:

https://drive.google.com/drive/u/5/home

2. Upload .mp3 file. Make sure the name is correct

3. Once it is uploaded, right click the file > share > share

4. Click on "restricted" and change to "anyone with the link". Copy this link

5. Open the link on a new tab

6. Run the following function:

```
var data = window.viewerData.config

function cleanGoogleDriveLink(e){return e}
function getDate(){
    var $data = document.querySelectorAll(`[aria-label="General Info"] > *:last-of-type [tabindex="0"]`);

for (var each of $data){
    var text = each.textContent.trim().toLowerCase();

    if (text.includes("created")){
        var _date = each.querySelector(`*:nth-child(2)`).textContent;
        var date = `${_date.split(" ")[1]} ${_date.split(" ")[2]}, ${new Date().getFullYear()}`;
        return date;

    }
}

    return null;
}

var obj = {};

obj.id = "";
obj.name = data.title.replace(".mp3", "");
obj.url = `https://drive.google.com/uc?id=${data.id}`
obj.download = `cleanGoogleDriveLink(${obj.url})`
obj.style = "CHANGE";
obj.mood = "CHANGE";
obj.release = getDate();
obj.duration = "CHANGE"

console.log(obj)

```

7. Copy the object logged

8. Update the data with "change"

## Deploying

`npm run build`
`git add .`
`git commit -m "deploy"`
`git subtree push --prefix dist origin gh-pages` or `gh-pages -d dist`

`npm run build && git add . && git commit -m "deploy" && git subtree push --prefix dist origin gh-pages `
