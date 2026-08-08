import { useEffect, useState } from "react";
import "./ProductForm.css";

const initialForm = {
  name: "",
  brand: "",
  category: "Lighting",
  quantity: "",
  buyingPrice: "",
  sellingPrice: "",
  image: ""
};


function ProductForm({
  isOpen,
  onClose,
  onSave,
  onUpdate,
  editingProduct
}) {

  const [formData, setFormData] =
    useState(initialForm);


  // Load product when editing
  useEffect(() => {

    if (editingProduct) {

      setFormData({
        ...initialForm,
        ...editingProduct
      });

    } else {

      setFormData(initialForm);

    }

  }, [editingProduct]);


  if (!isOpen) return null;


  // Handle normal inputs
  const handleChange = (e) => {

    const {
      name,
      value
    } = e.target;


    setFormData((prev) => ({

      ...prev,

      [name]: value

    }));

  };


  // Handle image
  const handleImage = (e) => {

    const file = e.target.files[0];

    if (!file) return;


    // Optional file-size protection
    if (file.size > 2 * 1024 * 1024) {

      alert(
        "Please choose an image smaller than 2MB."
      );

      return;

    }


    const reader = new FileReader();


    reader.onloadend = () => {

      setFormData((prev) => ({

        ...prev,

        image: reader.result

      }));

    };


    reader.readAsDataURL(file);

  };


  // Submit form
  const handleSubmit = (e) => {

    e.preventDefault();


    if (!formData.name.trim()) {

      alert("Please enter a product name.");

      return;

    }


    const product = {

      ...formData,

      quantity:
        Number(formData.quantity),

      buyingPrice:
        Number(formData.buyingPrice),

      sellingPrice:
        Number(formData.sellingPrice)

    };


    if (editingProduct) {

      onUpdate(product);

    } else {

      onSave({

        ...product,

        id: Date.now()

      });

    }


    setFormData(initialForm);

  };


  return (

    <div className="modal-overlay">

      <div className="modal">


        <h2>

          {editingProduct
            ? "Edit Product"
            : "Add Product"}

        </h2>


        <form onSubmit={handleSubmit}>


          {/* PRODUCT NAME */}

          <input

            type="text"

            name="name"

            placeholder="Product Name"

            value={formData.name}

            onChange={handleChange}

            required

          />


          {/* BRAND */}

          <input

            type="text"

            name="brand"

            placeholder="Brand"

            value={formData.brand}

            onChange={handleChange}

          />


          {/* CATEGORY */}

          <select

            name="category"

            value={formData.category}

            onChange={handleChange}

          >

            <option>Lighting</option>

            <option>Switches</option>

            <option>Sockets</option>

            <option>Cables</option>

            <option>Circuit Breakers</option>

            <option>Tools</option>

            <option>Batteries</option>

            <option>Other</option>

          </select>


          {/* QUANTITY */}

          <input

            type="number"

            name="quantity"

            placeholder="Quantity"

            value={formData.quantity}

            onChange={handleChange}

            min="0"

            required

          />


          {/* BUYING PRICE */}

          <input

            type="number"

            name="buyingPrice"

            placeholder="Buying Price"

            value={formData.buyingPrice}

            onChange={handleChange}

            min="0"

            required

          />


          {/* SELLING PRICE */}

          <input

            type="number"

            name="sellingPrice"

            placeholder="Selling Price"

            value={formData.sellingPrice}

            onChange={handleChange}

            min="0"

            required

          />


          {/* IMAGE */}

          <label className="image-label">

            Product Image

          </label>


          <input

            type="file"

            accept="image/*"

            onChange={handleImage}

          />


          {/* IMAGE PREVIEW */}

          {formData.image && (

            <div className="image-preview">

              <img

                src={formData.image}

                alt="Product Preview"

                className="preview-image"

              />

            </div>

          )}


          {/* BUTTONS */}

          <div className="modal-buttons">


            <button

              type="button"

              className="cancel-btn"

              onClick={() => {

                setFormData(initialForm);

                onClose();

              }}

            >

              Cancel

            </button>


            <button

              type="submit"

              className="save-btn"

            >

              {editingProduct

                ? "Update Product"

                : "Save Product"}

            </button>


          </div>


        </form>

      </div>

    </div>

  );

}


export default ProductForm;

