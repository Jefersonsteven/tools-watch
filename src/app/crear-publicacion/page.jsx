"use client";
import { useContext, useEffect, useState } from "react";
import { DragAndDrop } from "@/components/DragAndDrop/DragAndDrop";
import * as style from "./CreatePost.module.css";
import { validatePost } from "./asset/validate";
import { AppContext } from "@/context/AppContext";
import { uploadImage } from "@/components/Cloudinary/upload";
import Back from "@/components/back/Back";
import Loader from "@/components/Loader/Loader";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

function CreatePost() {
  const { form, setForm, errors, setErrors, userId, userData } =
    useContext(AppContext);
  const [urlsImages, setUrlsImages] = useState([]);
  const [imagesPrint, setImagesPrint] = useState([]);
  const router = useRouter();
  const [fetching, setFetching] = useState(false);
  const [message, setMessage] = useState("");
  
  useEffect(() => {
    if (!userData.firstname) router.push("/form/login");
  }, [userData, router]);

  function handleForm(event) {
    const name = event.target.name;
    const value = event.target.value;
    if (typeof form[name] !== undefined) {
      validatePost({ ...form, [name]: value }, errors, setErrors);
      setForm({ ...form, [name]: value });
    }
  }

  async function uploadImages(images) {
    const URLS = images.map(async (file) => await uploadImage(file));
    const urls = await Promise.all(URLS);
    return urls;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFetching(true);

    if (!userData.zipCode || !userData.country) {
      Swal.fire({
        title: "Vamos a Editar perfil?",
        text: "No has agregado el pais de residencia o el codigo postal",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, Vamos!!",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push(`/perfil/${userData.id}/edit`);
        } else if (result.isDenied) {
          router.push(`/home`);
        }
      });
      return;
    }

    const error = Object.values(errors).some((e) => e.length > 0);
    const post = Object.values(form).some((e) => e.length === 0);

    if (!error && !post) {
      if (form.photo.length > 0) {
        setMessage("Subiendo imagenes al servidor...");
        const urls = await uploadImages(form.photo, setUrlsImages);
        setMessage("Creando publicación...");
        const newPost = { ...form };
        newPost.photo = urls;
        newPost.price = Math.floor(newPost.price);

        const post = await fetch("/api/post", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newPost),
        });
        const data = await post.json();

        if (data.id) {
          Swal.fire({
            title: "¡Publicación creada!",
            text: "Tu publicación se ha creado correctamente.",
            icon: "success",
          }).then(() => {
            // Redireccionar al usuario
            router.push("/home");
          });

          // ...
        } else {
          Swal.fire({
            title: "Error",
            text: "Hubo un problema al crear la publicación.",
            icon: "error",
          });
        }

        setForm({
          title: "",
          content: "",
          brand: "",
          photo: [],
          category: "",
          price: "",
          type: "",
          authorId: userId,
        });
        setImagesPrint([]);
        setUrlsImages([]);
      }
    }

    setMessage("");
    setFetching(false);
  }

  return (
    <main className={style.main}>
      <section className={style.buttons}>
        <button
          className={form.type === "RENTAL" ? style.active : style.desactived}
          onClick={handleForm}
          name="type"
          value="RENTAL"
        >
          Arrendar
        </button>
        <button
          className={form.type === "SALE" ? style.active : style.desactived}
          onClick={handleForm}
          name="type"
          value="SALE"
        >
          Vender
        </button>
        <span>{errors.type}</span>
      </section>
      <section className={style.form}>
        <h2>Publica una herramienta</h2>
        <form action="">
          <div>
            <label htmlFor="">Titulo</label>
            <input
              onChange={handleForm}
              type="text"
              name="title"
              value={form.title}
            />
            <span>{errors.title}</span>
          </div>
          <div>
            <label htmlFor="">Descripción</label>
            <textarea
              onChange={handleForm}
              name="content"
              id=""
              cols="30"
              rows="5"
              value={form.content}
            ></textarea>
            <span>{errors.content}</span>
          </div>
          <div>
            <label htmlFor="">Marca</label>
            <select onChange={handleForm} name="brand" id="">
              <option value="false">Selecciona una Marca</option>
              <option value="stanley">Stanley</option>
              <option value="skil">Skil</option>
              <option value="philips">Philips</option>
              <option value="bosch">Bosch</option>
              <option value="castellari">Castellari</option>
              <option value="dewalt">DeWalt</option>
              <option value="dremel">Dremel</option>
              <option value="fischer">Fischer</option>
              <option value="karcher">Karcher</option>
              <option value="libus">Libus</option>
              <option value="makita">Makita</option>
              <option value="truper">Truper</option>
            </select>
            <span>{errors.brand}</span>
          </div>
          <div>
            <label htmlFor="">Precio</label>
            <input
              onChange={handleForm}
              type="number"
              name="price"
              value={form.price}
            />
            <span>{errors.price}</span>
          </div>
          <div>
            <label htmlFor="">Categoria</label>
            <select onChange={handleForm} name="category" id="">
              <option value="false">Selecciona Categoria</option>
              <option value="electrica">Herramienta Electrica</option>
              <option value="manual">Herramienta Manual</option>
              <option value="medicion">Herramienta de Medicion</option>
              <option value="corte">Herramienta de Corte</option>
              <option value="jardin">Herramienta de Jardin</option>
              <option value="fontaneria">Herramienta de Fontaneria</option>
              <option value="pintar">Herramienta para Pintar</option>
              <option value="soldar">Herramienta de Soldar</option>
            </select>
            <span>{errors.category}</span>
          </div>
          <div className={style.button}>
            <button onClick={handleSubmit}>Publicar</button>
            <button onClick={()=>router.back()}>Cancelar</button>
          </div>
          <div className={style.loaderContainer}>
            {fetching && (
              <>
                <Loader />
                <p>{message && message}</p>
              </>
            )}
          </div>
        </form>
      </section>
      <section>
        <DragAndDrop
          imagesPrint={imagesPrint}
          setImagesPrint={setImagesPrint}
        />
      </section>
    </main>
  );
}

export default CreatePost;
