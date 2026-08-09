
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
  image: "",
};

function ProductForm({
  isOpen,
  onClose,
  onSave,
  onUpdate,
  editingProduct,
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

        name:
          editingProduct.name || "",

        brand:
          editingProduct.brand || "",

        category:
          editingProduct.category ||
          "Lighting",

        shelfQuantity:
          editingProduct.shelfQuantity ??
          0,

        storeQuantity:
          editingProduct.storeQuantity ??
          0,

        buyingPrice:
          editingProduct.buyingPrice ??
          0,

        sellingPrice:
          editingProduct.sellingPrice ??
          0,

        image:
          editingProduct.image || "",
      });
    } else {
      setFormData(initialForm);
    }
  }, [editingProduct]);

  if (!isOpen) {
    return null;
  }

  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,

      [name]: value,
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
          reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name.trim()
    ) {
      alert(
        "Please enter a product name."
      );

      return;
    }

    const shelfQuantity =
      Number(
        formData.shelfQuantity
      ) || 0;

    const storeQuantity =
      Number(
        formData.storeQuantity
      ) || 0;

    const totalQuantity =
      shelfQuantity +
      storeQuantity;

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
        ) || 0,
    };

    // =========================
    // UPDATE
    // =========================

    if (editingProduct) {
      await onUpdate({
        ...product,

        id:
          editingProduct.id,
      });
    }

    // =========================
    // ADD
    // =========================

    else {
      await onSave(product);
    }

    setFormData(initialForm);
  };

  // =========================
  // TOTAL STOCK
  // =========================

  const totalStock =
    (Number(
      formData.shelfQuantity
    ) || 0) +
    (Number(
      formData.storeQuantity
    ) || 0);

  // =========================
  // CLOSE
  // =========================

  const handleClose = () => {
    setFormData(initialForm);

    onClose();
  };

  return (
    <div className="modal-overlay">

      <div className="modal">

        {/* TITLE */}

        <h2>
          {editingProduct
            ? "Edit Product"
            : "Add Product"}
        </h2>

        <form
          onSubmit={
            handleSubmit
          }
        >

          {/* PRODUCT NAME */}

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

          {/* BRAND */}

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

          {/* CATEGORY */}

          <select
            name="category"
            value={
              formData.category
            }
            onChange={
              handleChange
            }
          >
            <option value="Lighting">
              Lighting
            </option>

            <option value="Switches">
              Switches
            </option>

            <option value="Sockets">
              Sockets
            </option>

            <option value="Cables">
              Cables
            </option>

            <option value="Circuit Breakers">
              Circuit Breakers
            </option>

            <option value="Tools">
              Tools
            </option>

            <option value="Other">
              Other
            </option>
          </select>

          {/* SHELF QUANTITY */}

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

          {/* STORE QUANTITY */}

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

          {/* TOTAL STOCK */}

          <div className="quantity-preview">

            <span>
              Total Stock
            </span>

            <strong>
              {totalStock}
            </strong>

          </div>

          {/* BUYING PRICE */}

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
            step="0.01"
            required
          />

          {/* SELLING PRICE */}

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
            step="0.01"
            required
          />

          {/* IMAGE */}

          <label className="image-label">
            Product Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={
              handleImage
            }
          />

          {/* IMAGE PREVIEW */}

          {formData.image && (
            <div className="image-preview">

              <img
                src={
                  formData.image
                }
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

