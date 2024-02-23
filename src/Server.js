const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express()
app.use(cors());

const port = 3001

app.post('/api/orders', bodyParser.json(), (req, res) => { 

    let items = req.body;
    console.log(typeof(items));
    console.log(items);
    let parcels = []; let packages = []
    console.log(items);
    if (!items.length) {
      return res.json({packages});
    }
  
    // Process the order
    const maxParcelPrice = 250;
    const totalCost = items.reduce((acc, item) => acc + item.price, 0);
    const totalWeight = items.reduce((acc, item) => acc + item.weight, 0);
    const expectedNumParcels = totalCost / maxParcelPrice;
    const expectedParcelWeight = totalWeight / expectedNumParcels;
  
    let combinations = []; //all meaningfull permutations (items lists) //(factorial) principle //based recursive (top + iterate rest (head + tail))
  
    if (totalCost > maxParcelPrice) {
  
      buildAllVariations(items.slice(0, 1), items.slice(1));
  
      console.log({ combinations });
  
      let batches = [];
  
      combinations.forEach((e, i) => {
        console.log({ e });
        let batch = [];
        let parcel = [];
        let parcelPrice = 0;
        e.forEach((ie, ii) => {
          parcelPrice += ie.price;
          console.log({ parcelPrice });
          if (parcelPrice > maxParcelPrice) {
            console.log({ parcel })
            batch.push([...parcel]);
            parcel = [];
            parcelPrice = 0;
          }
          parcel.push(ie);
        })
        if (parcel.length) batch.push([...parcel]);
        console.log({ batch })
        if (batch.length) batches.push([...batch]);
      })
  
      console.log({ batches })
  
      let sorted = batches.sort((a, b) => { return mediumSigma(expectedParcelWeight, a) - mediumSigma(expectedParcelWeight, b) });
      console.log({ sorted })
      parcels = sorted.at(0)
      
      for(let i in parcels)
      {
        packages.push({
            packageId: i+1,
            items: parcels[i],
            totalCost: parcels[i].reduce((acc, item) => acc + item.price, 0),
            totalWeight: parcels[i].reduce((acc, item) => acc + item.weight, 0),
        })
      }
  
    } else {
      // Single package is enough
      const totalCost = items.reduce((acc, item) => acc + item.price, 0);
      const totalWeight = items.reduce((acc, item) => acc + item.weight, 0);
  
      packages.push({
        packageId: 1,
        items,
        totalCost,
        totalWeight,
      });
    }
  
    let rz = res.json({packages});
    return rz;
  
    //recursive
    function buildAllVariations(head, tail) {
      console.log({ head }, { tail })
      if (tail.length === 0) {
        combinations.push(head);
      }
      tail.forEach((item, index) => {
        buildAllVariations([...head, item], [...tail.slice(0, index), ...tail.slice(index + 1)]);
      })
    }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

function mediumSigma(avg, batch) {
    let rz = batch.reduce((s, parcel) => { return s + sigma(avg, parcel) },0)
    return rz / batch.length;
  }
  
  function sigma(avg, parcel) {
    let parcelWeight = parcel.reduce((acc, p) => {
      return acc + p.weight;
    },0)
    return Math.pow(avg - parcelWeight, 2);
  }  
  