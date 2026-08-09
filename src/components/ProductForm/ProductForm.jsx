import { useEffect, useState } from "react";
import "./ProductForm.css";

const initialForm = {
  name: "",
  brand: "",
  category: "Lighting",
  shelfQuantity: "",
  storeQuantity: "",
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


  // =========================
  // LOAD PRODUCT WHEN EDITING
  // =========================

  useEffect(() => {

    if (editingProduct) {

      setFormData({
        ...initialForm,

        ...editingProduct,

        shelfQuantity:
          editingProduct.shelfQuantity ?? 0,

        storeQuantity:
          editingProduct.storeQuantity ?? 0

      });

    } else {

      setFormData(initialForm);

    }

  }, [editingProduct]);


  if (!isOpen) return null;


  // =========================
  // HANDLE INPUT CHANGES
  // =========================

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


  // =========================
  // HANDLE IMAGE
  // =========================

  const handleImage = (e) => {

    const file =
      e.target.files[0];

    if (!file) return;


    // Maximum image size: 2MB

    if (
      file.size >
      2 * 1024 * 1024
    ) {

      alert(
        "Please choose an image smaller than 2MB."
      );

      return;

    }


    const reader =
      new FileReader();


    reader.onloadend = () => {

      setFormData((prev) => ({

        ...prev,

        image:
          reader.result

      }));

    };


    reader.readAsDataURL(file);

  };


  // =========================
  // SUBMIT FORM
  // =========================

  const handleSubmit = (e) => {

    e.preventDefault();


    // Product name validation

    if (
      !formData.name.trim()
    ) {

      alert(
        "Please enter a product name."
      );

      return;

    }


    // Convert quantities to numbers

    const shelfQuantity =
      Number(
        formData.shelfQuantity
      ) || 0;


    const storeQuantity =
      Number(
        formData.storeQuantity
      ) || 0;


    // Calculate total stock

    const totalQuantity =
      shelfQuantity +
      storeQuantity;


    // Create product object

    const product = {

      ...formData,

      shelfQuantity,

      storeQuantity,

      quantity:
        totalQuantity,

      buyingPrice:
        Number(
          formData.buyingPrice
        ) || 0,

      sellingPrice:
        Number(
          formData.sellingPrice
        ) || 0

    };


    // UPDATE PRODUCT

    if (editingProduct) {

      onUpdate(product);

    }

    // ADD NEW PRODUCT

    else {

      onSave({

        ...product,

        id: Date.now()

      });

    }


    // Reset form

    setFormData(
      initialForm
    );

  };


  // =========================
  // TOTAL STOCK PREVIEW
  // =========================

  const totalStock =

    (Number(
      formData.shelfQuantity
    ) || 0) +

    (Number(
      formData.storeQuantity
    ) || 0);


  // =========================
  // CLOSE FORM
  // =========================

  const handleClose = () => {

    setFormData(
      initialForm
    );

    onClose();

  };


  return (

    <div className="modal-overlay">

      <div className="modal">


        {/* =========================
            TITLE
        ========================= */}

        <h2>

          {editingProduct
            ? "Edit Product"
            : "Add Product"}

        </h2>


        <form
          onSubmit={handleSubmit}
        >


          {/* =========================
              PRODUCT NAME
          ========================= */}

          <input

            type="text"

            name="name"

            placeholder="Product Name"

            value={
              formData.name
            }

            onChange={
              handleChange
            }

            required

          />


          {/* =========================
              BRAND
          ========================= */}

          <input

            type="text"

            name="brand"

            placeholder="Brand"

            value={
              formData.brand
            }

            onChange={
              handleChange
            }

          />


          {/* =========================
              CATEGORY
          ========================= */}

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

  <option>Chargers</option>

  <option>Listening Aids</option>

  <option>Phone Lens</option>

  <option>Phone Charms</option>

  <option>Other</option>

</select>

          {/* =========================
              SHELF QUANTITY
          ========================= */}

          <label>
            Shelf Quantity
          </label>

          <input

            type="number"

            name="shelfQuantity"

            placeholder="Quantity on shelf"

            value={
              formData.shelfQuantity
            }

            onChange={
              handleChange
            }

            min="0"

            required

          />


          {/* =========================
              STORE / BOX QUANTITY
          ========================= */}

          <label>
            Store / Box Quantity
          </label>

          <input

            type="number"

            name="storeQuantity"

            placeholder="Quantity in store / boxes"

            value={
              formData.storeQuantity
            }

            onChange={
              handleChange
            }

            min="0"

            required

          />


          {/* =========================
              TOTAL STOCK
          ========================= */}

          <div className="quantity-preview">

            <span>
              Total Stock
            </span>

            <strong>
              {totalStock}
            </strong>

          </div>


          {/* =========================
              BUYING PRICE
          ========================= */}

          <input

            type="number"

            name="buyingPrice"

            placeholder="Buying Price"

            value={
              formData.buyingPrice
            }

            onChange={
              handleChange
            }

            min="0"

            required

          />


          {/* =========================
              SELLING PRICE
          ========================= */}

          <input

            type="number"

            name="sellingPrice"

            placeholder="Selling Price"

            value={
              formData.sellingPrice
            }

            onChange={
              handleChange
            }

            min="0"

            required

          />


          {/* =========================
              PRODUCT IMAGE
          ========================= */}

          <label
            className="image-label"
          >

            Product Image

          </label>


          <input

            type="file"

            accept="image/*"

            onChange={
              handleImage
            }

          />


          {/* =========================
              IMAGE PREVIEW
          ========================= */}

          {formData.image && (

            <div
              className="image-preview"
            >

              <img

                src={
                  formData.image
                }

                alt="Product Preview"

                className="preview-image"

              />

            </div>

          )}


          {/* =========================
              BUTTONS
          ========================= */}

          <div
            className="modal-buttons"
          >


            <button

              type="button"

              className="cancel-btn"

              onClick={
                handleClose
              }

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
