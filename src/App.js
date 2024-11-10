import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Autocomplete,
  Chip,
} from "@mui/material";

import UploadFileIcon from "@mui/icons-material/UploadFile";
import axios from "axios";

const AgregarProducto = () => {
  const [marcas, setMarca] = useState([
    { id: 1, nombre: "Peugeot" },
    { id: 2, nombre: "Fiat" },
    { id: 3, nombre: "LAMBORGHINI" },
  ]);
  const [categorias, setCategoria] = useState([
    { id: 1, nombre: "Auto" },
    { id: 2, nombre: "Ropa" },
    { id: 3, nombre: "Accesorios" },
  ]);
  const [hashtags, setHashtags] = useState([
    { id: 1, nombre: "#Nuevo" },
    { id: 2, nombre: "#Oferta" },
    { id: 3, nombre: "#Popular" },
  ]);

  const [selectedHashtags, setSelectedHashtags] = useState([]); // Hashtags seleccionados
  const [product, setProduct] = useState({
    nombre: "",
    precio: "",
    marca: null,
    categoria: null,
    descripcion: "",
    hashtags: "",
    stock: "",
    imagen: null,
    imagenUrl: null,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleHashtagChange = (event, newValue) => {
    setSelectedHashtags(newValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log("Producto Registrado", product);
  };
  const handleGenerarDesc = async () => {
    const title = product.nombre;

    if(title ==='') {
      
    }

    try {
      // Crear un FormData para enviar el título y la imagen (si existe)
      const formData = new FormData();
      formData.append("title", title);
  
      // Agregar la imagen solo si está definida
      if (product.imagen) {
        formData.append("imagen", product.imagen);
      }
  
      // Enviar la solicitud al backend con FormData
      const response = await axios.post("http://localhost:4000/generate-description", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      const descripcionGenerada = response.data.response;
      setLoading(false)
      // Actualizar el campo de descripción en el estado del producto
      setProduct((prevProduct) => ({
        ...prevProduct,
        descripcion: descripcionGenerada,
      }));
  
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  
  

  const handleImagenChange = (event) => {
    const MAX_FILE_SIZE_MB = 20;
    let file = event.target.files[0];

    if (file?.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      alert(`La imagen debe ser menor a ${MAX_FILE_SIZE_MB} MB`); // Corregido con comillas invertidas
      setProduct({ ...product, imagen: null });
    } else {
      let img = document.createElement("img");
      img.src = URL.createObjectURL(file);

      img.onerror = () => {
        alert("Hubo un error al cargar la imagen.");
      };

      img.onload = () => {
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");

        const originalWidth = img.width;
        const originalHeight = img.height;

        const maxDimension = 800;

        let newWidth, newHeight;
        if (originalWidth > originalHeight) {
          newWidth = maxDimension;
          newHeight = (originalHeight * maxDimension) / originalWidth;
        } else {
          newHeight = maxDimension;
          newWidth = (originalWidth * maxDimension) / originalHeight;
        }

        canvas.width = newWidth;
        canvas.height = newHeight;

        ctx.drawImage(img, 0, 0, newWidth, newHeight);

        canvas.toBlob((blob) => {
          let newFile = new File([blob], "image.jpeg", { type: "image/jpeg" });
          const imageURL = URL.createObjectURL(newFile);
          setProduct({ ...product, imagen: newFile, imagenUrl: imageURL });
        }, "image/jpeg");
      };
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          width: "100%",
          background: "linear-gradient(135deg, #4a90e2, #ff3370)",
          padding:"16px"
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 4,
            maxWidth: { xs: "90%", sm: "80%", md: "600px" },
            width: "100%",
            backgroundColor: "#fff",
            padding: "32px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography variant="h4" component="h2">
            Agregar Producto
          </Typography>

          <TextField
            label="Nombre"
            name="nombre"
            value={product.nombre}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Precio"
            name="precio"
            type="number"
            value={product.precio}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Stock"
            name="stock"
            type="number"
            value={product.stock}
            onChange={handleChange}
            fullWidth
          />

          <Autocomplete
            options={marcas}
            getOptionLabel={(option) => option.nombre}
            value={product.marca}
            onChange={(e, newValue) =>
              setProduct((prevProduct) => ({ ...prevProduct, marca: newValue }))
            }
            renderInput={(params) => (
              <TextField {...params} label="Marca" fullWidth />
            )}
            fullWidth
          />

          <Autocomplete
            options={categorias}
            getOptionLabel={(option) => option.nombre}
            value={product.categoria}
            onChange={(e, newValue) =>
              setProduct((prevProduct) => ({
                ...prevProduct,
                categoria: newValue,
              }))
            }
            renderInput={(params) => (
              <TextField {...params} label="Categoría" fullWidth />
            )}
            fullWidth
          />
          <Autocomplete
            multiple
            id="hashtags-autocomplete"
            options={hashtags}
            getOptionLabel={(option) => option.nombre}
            value={selectedHashtags}
            onChange={handleHashtagChange}
            renderTags={(tagValue, getTagProps) =>
              tagValue.map((option, index) => (
                <Chip
                  label={option.nombre}
                  {...getTagProps({ index })}
                  key={option.nombre}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Hashtags"
                placeholder="Agrega hashtags"
                fullWidth
              />
            )}
            fullWidth
          />

          <TextField
            label="Descripción"
            name="descripcion"
            value={product.descripcion}
            onChange={handleChange}
            multiline
            rows={4}
            fullWidth
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading || !product.nombre}
            onClick={handleGenerarDesc}
            sx={{
              background: "#033E8C",
              color: "#fff",
              padding: "8px 16px",
              borderRadius: "20px",
              fontWeight: "bold",
              transition: "transform 0.3s",
              "&:hover": {
                background: "#FF3370",
                transform: "scale(1.05)",
              },
            }}
          >
            {loading ? "Generando" : "Generar Descripcion"}
          </Button>

          <Button
            variant="contained"
            component="label"
            sx={{
              background: "#033E8C",
              color: "#fff",
              padding: "8px 16px",
              borderRadius: "20px",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: "8px", // Espacio entre el icono y el texto
              transition: "transform 0.3s",
              "&:hover": {
                background: "#FF3370",
                transform: "scale(1.05)",
              },
            }}
          >
            <UploadFileIcon /> {/* Ícono de upload */}
            Subir Imagen
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImagenChange}
            />
          </Button>

          {product.imagen && (
            <Typography
              variant="body2"
              component="p"
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span>Previsualizacion de la imagen</span>
              <img
                width="250px"
                src={product.imagenUrl}
                alt="Imagen seleccionada"
                style={{
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  objectFit: "cover",
                }}
              />
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{
              background: "#033E8C",
              color: "#fff",
              padding: "8px 16px",
              borderRadius: "20px",
              fontWeight: "bold",
              transition: "transform 0.3s",
              "&:hover": {
                background: "#FF3370",
                transform: "scale(1.05)",
              },
            }}
          >
            Guardar Producto
          </Button>
        </Box>
      </Box>
    </form>
  );
};

export default AgregarProducto;
