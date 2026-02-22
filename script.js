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

    async function generatePDF(){
    const preview = document.getElementById("preview");

    const canvas = await html2canvas(preview,{
        scale:2
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p","mm","a4");

    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = canvas.height * imgWidth / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData,"PNG",0,position,imgWidth,imgHeight);
    heightLeft -= pageHeight;

    while(heightLeft >= 0){
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData,"PNG",0,position,imgWidth,imgHeight);
        heightLeft -= pageHeight;
    }

    pdf.save("chatgpt-chat.pdf");
}
}

