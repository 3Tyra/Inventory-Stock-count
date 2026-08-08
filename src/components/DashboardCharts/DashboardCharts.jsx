import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import "./DashboardCharts.css";


function DashboardCharts({ products, sales }) {


  // CATEGORY DATA

  const categoryData = {};


  products.forEach((product)=>{


    if(categoryData[product.category]){

      categoryData[product.category]++;

    } else {

      categoryData[product.category] = 1;

    }


  });



  const categoryChart = Object.entries(categoryData)
  .map(([name,value])=>({

    name,
    value

  }));





  // SALES DATA


  const salesChart = sales.map((sale)=>({

    name: sale.productName,

    quantity: Number(sale.quantity)

  }));







  return (

    <div className="charts-container">





      <div className="chart-card">

        <h2>
          🏷 Products by Category
        </h2>



        <ResponsiveContainer
          width="100%"
          height={300}
        >


          <PieChart>


            <Pie

              data={categoryChart}

              dataKey="value"

              nameKey="name"

              outerRadius={100}

              label

            >


              {
                categoryChart.map((item,index)=>(

                  <Cell key={index}/>

                ))
              }


            </Pie>


            <Tooltip />


          </PieChart>


        </ResponsiveContainer>


      </div>









      <div className="chart-card">


        <h2>
          🛒 Sales Performance
        </h2>



        <ResponsiveContainer
          width="100%"
          height={300}
        >


          <BarChart data={salesChart}>


            <Bar
              dataKey="quantity"
            />


            <Tooltip />


          </BarChart>


        </ResponsiveContainer>


      </div>






    </div>

  );

}



export default DashboardCharts;