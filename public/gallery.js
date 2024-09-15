document.addEventListener('DOMContentLoaded', function() {
    // Ejemplo de imágenes con comentarios (puedes reemplazarlo con datos reales).
    const photos = [
        { src: 'photo1.jpg', description: 'Foto de Retina 1' },
        { src: 'photo2.jpg', description: 'Foto de Retina 2' }
    ];

    const photoGallery = document.getElementById('photoGallery');
    photos.forEach(photo => {
        const img = document.createElement('img');
        img.src = photo.src;
        img.alt = photo.description;

        const desc = document.createElement('p');
        desc.textContent = photo.description;

        photoGallery.appendChild(img);
        photoGallery.appendChild(desc);
    });

    // Manejo de comentarios
    const commentForm = document.getElementById('commentForm');
    const commentsSection = document.getElementById('commentsSection');

    commentForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const commentText = document.getElementById('comment').value;
        const commentElement = document.createElement('p');
        commentElement.textContent = commentText;

        commentsSection.appendChild(commentElement);

        // Limpiar el textarea
        document.getElementById('comment').value = '';
    });
});