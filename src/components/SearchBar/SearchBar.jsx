import "./SearchBar.css";


function SearchBar({

  searchTerm,
  setSearchTerm,
  categoryFilter,
  setCategoryFilter

}) {


  return (

    <div className="search-bar">


      {/* SEARCH */}

      <input

        type="text"

        placeholder="🔍 Search product..."

        value={searchTerm}

        onChange={(e) =>
          setSearchTerm(e.target.value)
        }

      />


      {/* CATEGORY FILTER */}

      <select

        value={categoryFilter}

        onChange={(e) =>
          setCategoryFilter(e.target.value)
        }

      >

        <option>
          All Categories
        </option>

        <option>
          Lighting
        </option>

        <option>
          Switches
        </option>

        <option>
          Sockets
        </option>

        <option>
          Cables
        </option>

        <option>
          Circuit Breakers
        </option>

        <option>
          Tools
        </option>

        <option>
          Batteries
        </option>

        <option>
          Chargers
        </option>

        <option>
          Listening Aids
        </option>

        <option>
          Phone Lenses
        </option>

        <option>
          Phone Charms
        </option>

        <option>
          Other
        </option>

      </select>


    </div>

  );

}


export default SearchBar;

