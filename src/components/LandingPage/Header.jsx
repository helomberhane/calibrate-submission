import React, { Component } from 'react'
import _map from 'lodash/map'

const DRINK_BREWING = "Drink Brewing..."
const DRINK_MADE = "Drink Made"
const DRINK_PICKED_UP = "Drink Picked Up"
const STILL_BREWING = "Still brewing..."
const BORED_BARISTA = "Bored barsita..."

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  })
}

function MenuItem(props) {
  const { drink, onClick } = props
  return (
      <div onClick={onClick} title="Order" className="header__menu_item_container">
        <h1 className="header__menu_item_header">{drink.name}</h1>
      </div>
  );
}

export default  class Header extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isBrewing: false,
      orderQueue: [],
      barQueue: [],
      orderStatus: "",
    }

    this.addDrinkToQueue = this.addDrinkToQueue.bind(this)
    this.brewDrink = this.brewDrink.bind(this)
    this.pickUpDrink = this.pickUpDrink.bind(this)
  }
  componentDidMount() {
    setInterval(this.brewDrink, 1000, this.state.orderQueue)
    setInterval(this.pickUpDrink, 3000, this.state.barQueue)
  }
  addDrinkToQueue(drink) {
    var currentOrderQueue = this.state.orderQueue

    currentOrderQueue.push(drink)  
    this.setState({
      orderQueue: currentOrderQueue,
    })

    this.brewDrink(currentOrderQueue)
  }
  async brewDrink(currentOrderQueue) {
    if (currentOrderQueue.length > 0 && this.state.isBrewing == false) {
      let drink = currentOrderQueue.shift()

      console.log(DRINK_BREWING)
      this.setState({
        orderStatus: DRINK_BREWING,
        isBrewing: true,
      })

      await sleep(drink.brewTime * 1000)
      console.log(DRINK_MADE)

      var currentBarQueue = this.state.barQueue
      currentBarQueue.push(drink)

      this.setState({
        orderStatus: DRINK_MADE,
        isBrewing: false,
        orderQueue: currentOrderQueue,
        barQueue: currentBarQueue,
      })
    } else {
      if (this.state.isBrewing === true) {
        console.log(STILL_BREWING)  
      } else {
        console.log(BORED_BARISTA)  
      }
    }
  }
  async pickUpDrink(currentBarQueue) {
    if (currentBarQueue.length > 0) {
      console.log(DRINK_PICKED_UP)
      let drink = currentBarQueue.shift()
      this.setState({
        orderStatus: DRINK_PICKED_UP,
        isBrewing: false,
        barQueue: currentBarQueue,
      })
    }
  }
  render() {
  
    const drinks  = [
      {
        "id": 1,
        "name": "Cafe Au Lait",
        "brewTime": 4
      },
      {
        "id": 2,
        "name": "Cappuccino",
        "brewTime": 10
      },
      {
        "id": 3,
        "name": "Expresso",
        "brewTime": 15
      }
    ]

    var menuItems = _map(drinks, (drink) => {
      return (
        <MenuItem key={drink.id} drink={drink} onClick={() => this.addDrinkToQueue(drink)} />
      )
    })

    return (
      <div className="header__main_container">
        <h1 className="header__main_header">Café Calibrate</h1>
        { menuItems }
        <p className="header__order_status"><span className="header__counter_title_span">Order Status:</span> { this.state.orderStatus === "" ? BORED_BARISTA : this.state.orderStatus }</p>
        <p className="header__counter_title"><span className="header__counter_title_span">Current Orders:</span> { this.state.orderQueue.length }</p>
        <p className="header__counter_title"><span className="header__counter_title_span">Bar Orders:</span> { this.state.barQueue.length }</p>
      </div>
    )
  }
}
