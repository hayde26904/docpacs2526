const fs = require('fs');
const csv = require('csv-parser');
const orders = [];

fs.createReadStream('data.csv')
    .pipe(csv())
    .on('data', (data) => {
        if (orders.length === 0 || data.customer){
            orders.push({
                customer: data.customer,
                address: data.address,
                items: []
            })
        }

        orders[orders.length-1].items.push({
            item: data.item,
            quantity: parseInt(data.quantity),
            price: Number(data.price),
            total: parseInt(data.quantity) * Number(data.price)
        })
    })
    .on('close', () => {
        let subtotal = 0;
        for(order of orders) {
            console.log("------------------------------------------------------------")
            console.log("Name\t" + order.customer);
            console.log("Address\t" + order.address + '\n');
            console.log("Item\t\t\t\t\tPrice\t\tQTY\t\tTotal");
            for(item of order.items) {
                console.log(item.item.substring(0,28)+'...'+'\t\t'+item.price+'\t\t'+item.quantity+'\t\t'+item.total);
                subtotal+=item.total;
            }
            let tax = subtotal * 0.06;
            let shipping = subtotal > 50 ? 0.00 : 10.00;
            let grandTotal = subtotal + tax + shipping;
            console.log("Subtotal\t"+subtotal);
            console.log("Sales Tax\t"+tax.toFixed(2));
            console.log("Shipping\t"+shipping.toFixed(2));
            console.log("Grand Total\t"+grandTotal.toFixed(2));
            console.log("------------------------------------------------------------")
        }
    })