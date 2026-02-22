const { jsPDF } = window.jspdf;

async function loadChat(){
    const link = document.getElementById("chatLink").value;
    const preview = document.getElementById("preview");

    if(!link){
        alert("Paste a shared chat link");
        return;
    }

    try{
        preview.innerHTML = "Loading chat...";

        // Fetch shared chat page
        const res = await fetch(link);
        const text = await res.text();

        // Parse HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(text,"text/html");

        // NOTE:
        // Shared ChatGPT pages store messages inside main tags.
        // We extract visible text only.
        const content = doc.querySelector("main");

        if(!content){
            preview.innerHTML = "Unable to extract chat content.";
            return;
        }

        preview.innerHTML = content.innerText;

        document.getElementById("downloadBtn").style.display="block";

    }catch(err){
        preview.innerHTML = "Error loading chat (CORS may block some links)";
        console.error(err);
    }
}

