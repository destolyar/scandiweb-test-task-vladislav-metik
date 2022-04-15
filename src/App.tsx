import React from "react";
import { Route, Routes } from "react-router-dom";
import { Footer } from "./components/Footer/Footer";
import { Header } from "./components/Header/Header";
import { Cart } from "./components/Cart/Cart";
import { Catalog } from "./components/Catalog/Catalog";
import { ErrorLink } from "./pages/ErrorLink";
import { ItemPage } from "./components/ItemPage/ItemPage";
import './styles/app.scss'
import { AppProps, AppState } from "./entites/interfaces/components/app";

export class App extends React.Component<AppProps, AppState> {
  state = {
    currency: {
      label: "USD",
      symbol: "$"
    },
    category: "all"
  }

  render() {
    return (
      <div className="App">
        <Header
        currency={this.state.currency} 
        setCurrency={(symbol:string, label: string) => {
          this.setState({
            currency: {
              symbol: symbol,
              label: label
            }
          })
        }}
        category={this.state.category}
        setCategory={(category: string) => {
          this.setState({
            category: category
          })
        }}
        />
        <Routes>
          <Route path="/" element={<Catalog currency={this.state.currency} category={this.state.category}/>}></Route>
          <Route path="cart" element={<Cart/>}></Route>
          <Route path="/product/:productName" element={<ItemPage/>}></Route>
          <Route path="*" element={<ErrorLink/>}></Route>
        </Routes>
        <Footer/>
      </div>
    );
  }
}