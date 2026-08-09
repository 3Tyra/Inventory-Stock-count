import { useEffect, useState } from "react";
import "./SalesModal.css";

function SalesModal({
  product,
  isOpen,
  onClose,
  onSell
}) {

  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  // =========================
  // RESET MODAL
  // =========================

  useEffect(() => {

    if (isOpen) {

      setQuantity("");
      setError("");
      setShowConfirmation(false);

    }

  }, [isOpen, product]);


  // =========================
  // HIDE MODAL
  // =========================

  if (!isOpen || !product) {
    return null;
  }


  // =========================
  // VALUES
  // =========================

  const soldQuantity =
    Number(quantity) || 0;

  const sellingPrice =
    Number(product.sellingPrice) || 0;

  const buyingPrice =
    Number(product.buyingPrice) || 0;

  const availableStock =
    Number(product.quantity) || 0;

  const revenue =
    sellingPrice * soldQuantity;

  const profit =
    (sellingPrice - buyingPrice) *
    soldQuantity;


  // =========================
  // VALIDATE SALE
  // =========================

  const handleSubmit = (e) => {

    e.preventDefault();

    setError("");


    if (!quantity) {

      setError(
        "Please enter the quantity sold."
      );

      return;

    }


    if (soldQuantity <= 0) {

      setError(
        "Quantity must be greater than 0."
      );

      return;

    }


    if (soldQuantity > availableStock) {

      setError(
        `Only ${availableStock} units are available.`
      );

      return;

    }


    // Show confirmation screen

    setShowConfirmation(true);

  };


  // =========================
  // COMPLETE SALE
  // =========================

  const confirmSale = () => {

    onSell(
      product,
      soldQuantity
    );

    setQuantity("");

    setShowConfirmation(false);

    onClose();

  };


  // =========================
  // CANCEL CONFIRMATION
  // =========================

  const cancelConfirmation = () => {

    setShowConfirmation(false);

  };


  // =========================
  // PAGE
  // =========================

  return (

    <div className="sales-overlay">

      <div className="sales-modal">


        {!showConfirmation ? (

          <>
            {/* =========================
                SELL FORM
            ========================= */}

            <h2>
              🛒 Sell Product
            </h2>


            <h3>
              {product.name}
            </h3>


            <p>
              Available Stock:{" "}
              <strong>
                {availableStock}
              </strong>
            </p>


            <p>
              Selling Price:{" "}
              <strong>
                KSh{" "}
                {sellingPrice.toLocaleString()}
              </strong>
            </p>


            <form
              onSubmit={handleSubmit}
            >

              <label>
                Quantity Sold
              </label>


              <input
                type="number"
                min="1"
                max={availableStock}
                placeholder="Enter quantity"
                value={quantity}
                onChange={(e) => {

                  setQuantity(
                    e.target.value
                  );

                  setError("");

                }}
              />


              {/* =========================
                  ERROR
              ========================= */}

              {error && (

                <p className="sale-error">
                  ⚠️ {error}
                </p>

              )}


              {/* =========================
                  SALE PREVIEW
              ========================= */}

              {soldQuantity > 0 &&
                soldQuantity <= availableStock && (

                  <div className="sale-preview">

                    <div>

                      <span>
                        Quantity
                      </span>

                      <strong>
                        {soldQuantity}
                      </strong>

                    </div>


                    <div>

                      <span>
                        Revenue
                      </span>

                      <strong>
                        KSh{" "}
                        {revenue.toLocaleString()}
                      </strong>

                    </div>


                    <div>

                      <span>
                        Profit
                      </span>

                      <strong>
                        KSh{" "}
                        {profit.toLocaleString()}
                      </strong>

                    </div>

                  </div>

                )}


              {/* =========================
                  BUTTONS
              ========================= */}

              <div className="sales-buttons">

                <button
                  type="button"
                  onClick={onClose}
                >
                  Cancel
                </button>


                <button
                  type="submit"
                >
                  Continue
                </button>

              </div>

            </form>

          </>

        ) : (

          /* =========================
             CONFIRMATION SCREEN
          ========================= */

          <div className="sale-confirmation">

            <div className="confirmation-icon">
              🛒
            </div>


            <h2>
              Complete Sale?
            </h2>


            <p>

              You are about to sell{" "}

              <strong>
                {soldQuantity}
              </strong>{" "}

              {product.name}
              {soldQuantity !== 1
                ? "s"
                : ""}.

            </p>


            {/* =========================
                SUMMARY
            ========================= */}

            <div className="confirmation-summary">

              <div>

                <span>
                  Quantity
                </span>

                <strong>
                  {soldQuantity}
                </strong>

              </div>


              <div>

                <span>
                  Revenue
                </span>

                <strong>
                  KSh{" "}
                  {revenue.toLocaleString()}
                </strong>

              </div>


              <div>

                <span>
                  Profit
                </span>

                <strong>
                  KSh{" "}
                  {profit.toLocaleString()}
                </strong>

              </div>

            </div>


            {/* =========================
                WARNING
            ========================= */}

            <p className="confirmation-warning">

              This will reduce your stock by{" "}
              {soldQuantity}.

            </p>


            {/* =========================
                CONFIRM BUTTONS
            ========================= */}

            <div className="sales-buttons">

              <button
                type="button"
                onClick={
                  cancelConfirmation
                }
              >
                Go Back
              </button>


              <button
                type="button"
                className="confirm-sale-btn"
                onClick={confirmSale}
              >
                ✓ Complete Sale
              </button>

            </div>

          </div>

        )}

      </div>

    </div>

  );

}

export default SalesModal;