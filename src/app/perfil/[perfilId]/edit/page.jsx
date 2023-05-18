"use client";

import { useContext, useEffect, useState } from "react";
import styles from "./perfilForm.module.css";
import { AppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { IoCaretBack } from "react-icons/io5";
import Link from "next/link";
import ImageUploader from "@/components/FileUploader/ImageUploader";
import { uploadImage } from "@/components/Cloudinary/upload";
import Loader from "@/components/Loader/Loader";

const EditUser = () => {
  const { push } = useRouter();
  const {
    userData,
    userId,
    setUserData,
    countries,
    newPetition,
    saveInLocalStorage,
  } = useContext(AppContext);
  const [form, setForm] = useState({
    firstname: userData.firstname,
    lastname: userData.lastname,
    email: userData.email,
    phoneNumber: userData.phoneNumber,
    country: userData.country,
    zipCode: userData.zipCode,
    photo: userData.photo,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [inPetition, setInPetition] = useState("");

  useEffect(() => console.log(form), [form]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const body = {
      email: form.email,
      password: form.password,
    };
    setInPetition("Validando contraseña...");
    setIsActive(true);
    try {
      let responseOfValidation = await newPetition(
        "PUT",
        "/api/loginValidate",

        body
      );

      if (!responseOfValidation.error) {
        let uploadedImageUrl = null;
        if (selectedFile) {
          setInPetition("Subiendo nueva imagen...");
          uploadedImageUrl = await uploadImage(selectedFile);
        }
        setInPetition("Aplicando cambios...");
        let response = await newPetition("PUT", `/api/user/${userData.email}`, {
          ...form,
          photo: uploadedImageUrl,
        });

        console.log(response);
        if (!response.error) {
          setInPetition("Cambios aplicados correctamente");
          setUserData(response);
          saveInLocalStorage("token", response);
          push(`perfil/${userData.id}`);
          const Toast = Swal.mixin({
            toast: true,
            position: "bottom-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener("mouseenter", Swal.stopTimer);
              toast.addEventListener("mouseleave", Swal.resumeTimer);
            },
          });

          Toast.fire({
            icon: "success",
            title: "Cambios aplicados correctamente",
          });
        } else {
          throw new Error(response.error);
        }
      } else {
        throw new Error(responseOfValidation.error);
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Se produjo un error al intentar actualizar datos",
        text: `Motivo del error: ${error}`,
        footer: "Intenta nuevamente",
      });
    }
    setInPetition("");
    setIsActive(false);
  };

  const handleChange = (event) => {
    const value = event.target.value;
    const name = event.target.name;

    setForm({ ...form, [name]: value });
  };

  const handleCancel = (event) => {
    event.preventDefault();
    push(`/perfil/${userData.id}`);
  };

  return (
    <>
      <div>
        <Link href={`/perfil/${userId}`}>
          <IoCaretBack size={50} className={styles.IoCaretBack} />
        </Link>
        <h2>Editar perfil de toolmatch</h2>
      </div>
      <section className={styles.section}>
        <div className={styles.imageContainer}>
          <div className={styles.containers}>
            <ImageUploader setSelectedFile={setSelectedFile} form={form} />
            <Link
              href={`perfil/${userId}/changePassword`}
              className={styles.changePwdButton}
            >
              Cambiar contraseña
            </Link>
          </div>
        </div>
        <div className={styles.formContainer}>
          <form className={styles.editUserDataForm} onSubmit={handleSubmit}>
            <div className={styles.inputsContainer}>
              <div className={styles.inputContainer}>
                <label htmlFor="firstname">Nombre:</label>
                <input
                  type="text"
                  name="firstname"
                  value={form.firstname}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.inputContainer}>
                <label htmlFor="lastname">Apellido:</label>
                <input
                  type="text"
                  name="lastname"
                  value={form.lastname}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className={styles.inputsContainer}>
              <div className={styles.inputContainer}>
                <label htmlFor="email">Correo:</label>
                <input type="text" name="email" disabled value={form.email} />
              </div>
              <div className={styles.inputContainer}>
                <label htmlFor="phoneNumber">Celular:</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={form.phoneNumber && form.phoneNumber}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className={styles.inputsContainer}>
              <div className={styles.selectContainer}>
                <label htmlFor="country">País donde resides actualmente:</label>

                <select
                  id="country"
                  name="country"
                  defaultValue={form.country ? form.country : "null"}
                  onChange={handleChange}
                >
                  {Object.entries(countries).map(([property, value]) => {
                    return (
                      <option key={property} value={property}>
                        {value}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className={styles.inputContainer}>
                <label htmlFor="zipCode">Código postal</label>

                <input
                  type="text"
                  name="zipCode"
                  value={form.zipCode && form.zipCode}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor="password">Contraseña para aplicar cambios:</label>
              <input type="password" name="password" onChange={handleChange} />
            </div>
            <div className={styles.buttonsContainer}>
              <button
                className={styles.buttonCancel}
                onClick={handleCancel}
                disabled={isActive}
              >
                Cancelar
              </button>
              <button
                className={styles.buttonSubmit}
                type="submit"
                disabled={isActive}
              >
                Aplicar cambios
              </button>
            </div>
            <div className={styles.loaderContainer}>
              {isActive && (
                <>
                  <Loader />
                  <p>{inPetition && inPetition}</p>
                </>
              )}
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default EditUser;
