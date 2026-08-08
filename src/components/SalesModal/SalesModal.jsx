import { useEffect, useState } from "react";
import "./SalesModal.css";


function SalesModal({
  product,
  isOpen,
  onClose,
  onSell
}) {


  const [quantity, setQuantity] =
    useState("");


  const [error, setError] =
    useState("");


  const [showConfirmation, setShowConfirmation] =
    useState(false);


  // Reset everything whenever
  // the modal opens
  useEffect(() => {

    if (isOpen) {

      setQuantity("");

      setError("");

      setShowConfirmation(false);

    }

  }, [isOpen, product]);


  if (!isOpen || !product) {
    return null;
  }


  const soldQuantity =
    Number(quantity) || 0;


  const sellingPrice =
    Number(product.sellingPrice) || 0;


  const buyingPrice =
    Number(product.buyingPrice) || 0;


  const revenue =
    sellingPrice * soldQuantity;


  const profit =
    (sellingPrice - buyingPrice) *
    soldQuantity;


  // STEP 1: Validate quantity

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


    if (
      soldQuantity >
      Number(product.quantity)
    ) {

      setError(
        `Only ${product.quantity} units are available.`
      );

      return;

    }


    // Show our own confirmation
    // instead of window.confirm()

    setShowConfirmation(true);

  };


  // STEP 2: Complete the sale

  const confirmSale = () => {

    onSell(
      product,
      soldQuantity
    );


    setQuantity("");

    setShowConfirmation(false);

    onClose();

  };


  // Cancel confirmation

  const cancelConfirmation = () => {

    setShowConfirmation(false);

  };


  return (

    <div className="sales-overlay">


      <div className="sales-modal">


        {!showConfirmation ? (

          <>


            <h2>
              🛒 Sell Product
            </h2>


            <h3>
              {product.name}
            </h3>


            <p>
              Available Stock:{" "}
              <strong>
                {product.quantity}
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
                max={product.quantity}
                placeholder="Enter quantity"
                value={quantity}
                onChange={(e) => {

                  setQuantity(
                    e.target.value
                  );

                  setError("");

                }}
              />


              {/* ERROR */}

              {error && (

                <p className="sale-error">
                  ⚠️ {error}
                </p>

              )}


              {/* SALE PREVIEW */}

              {soldQuantity > 0 &&
                soldQuantity <=
                  product.quantity && (

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

          /* CONFIRMATION SCREEN */

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


            <p className="confirmation-warning">

              This will reduce your stock by{" "}
              {soldQuantity}.

            </p>


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

