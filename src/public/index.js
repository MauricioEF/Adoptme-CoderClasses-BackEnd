document.addEventListener('submit',enviarFormulario);

function enviarFormulario(event){
    event.preventDefault();
    let form= document.getElementById('petForm');
    let data = new FormData(form);
    fetch('/api/pets',{
        method:'POST',
        body:data
    }).then(result=>{
        return result.json();
    }).then(json=>{
        Swal.fire({
            title:'Éxito',
            text:json.message,
            icon:'success',
            timer:2000,
        }).then(result=>{
            location.href='/'
        })
    })
}

document.getElementById("image").onchange = (e)=>{
    let read = new FileReader();
    read.onload = e =>{
        document.querySelector('.image-text').innerHTML = "¡Qué hermoso!"
        document.getElementById("preview").src = e.target.result;
    }
    
    read.readAsDataURL(e.target.files[0])
}