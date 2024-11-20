function toggleChat() {
    const chat = document.getElementById('chat');
    
    if (chat.style.display === "none") {
        chat.style.display = "block";
    } else {
        chat.style.display = "none";
    }
}