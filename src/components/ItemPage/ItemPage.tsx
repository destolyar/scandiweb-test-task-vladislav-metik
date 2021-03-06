import React from "react"
import '../../styles/components/item-page.scss'
import { RouteComponentProps, withRouter } from "react-router-dom"
import { getProductById } from "../../app/requests"
import { ItemPageProps, ItemPageState } from "../../entites/interfaces/components/item-page"
import { CurrencyContext } from "../../context/CurrencyContext"
import { Attributes } from "./Attributes"
import { AttributesState } from "../../entites/interfaces/components/attributes"
import { AddProductButton } from "./AddProductButton"


class ItemPage extends React.Component<ItemPageProps & RouteComponentProps<any>, ItemPageState> {
  state: ItemPageState = {
    product: {
      __typename: "Product",
      id: '',
      name: '',
      inStock: false,
      gallery: [],
      description: '',
      category: '',
      brand: '',
      prices: [],
      attributes: []
    },
    currentImage: '',
    price: {
      amount: '',
      currency: {
        label: '',
        symbol: ''
      }
    },
    pickedAttributes: []
  }

  static contextType = CurrencyContext
  
  componentDidMount() {
    getProductById(this.props.match.params.id).then(i => {
      const {currency} = this.context
      const price = i.data.product.prices.filter((i: {currency: {label: string}}) => i.currency.label === currency.label)[0]

      this.setState({
        product: i.data.product,
        currentImage: i.data.product.gallery[0],
        price: {
          amount: price.amount,
          currency: {
            label: price.currency.label,
            symbol: price.currency.symbol
          }
        }
      })
    })
  }

  componentDidUpdate() {
    getProductById(this.props.match.params.id).then(i => {
      const {currency} = this.context
      const price = i.data.product.prices.filter((i: {currency: {label: string}}) => 
      i.currency.label === currency.label)[0]

      if(price.amount !== this.state.price.amount) {
        this.setState({
          price: {
            amount: price.amount,
            currency: {
              label: price.currency.label,
              symbol: price.currency.symbol
            }
          }
        })
      }
    })
  }
  
  render() {
    const setAttribute = (attribute: AttributesState, isFirstSet=false) => {
      if(isFirstSet) {
        this.setState((state) => ({
          pickedAttributes: [...state.pickedAttributes, attribute]
        }))
      } else {
        this.setState((state) => ({
          pickedAttributes: [...state.pickedAttributes.filter((item) => item.name !== attribute.name), attribute]
        }))
      }
    }

    return(
      <main className="item-page">
        <div className="item-page__images">
          <div className="item-page__images__gallery">
            {this.state.product.gallery.map((image: string) => 
            <img key={image} className="item-page__images__gallery__item" src={image} 
            onClick={() => this.setState({currentImage: image})}/>)}
          </div>
          <img className="item-page__images__image" src={this.state.currentImage}/>
        </div>
        <div className="item-page__info">
        <div className="item-page__info__title">
          <h2 className="item-page__info__title__brand">{this.state.product.brand}</h2>
          <h2 className="item-page__info__title__name">{this.state.product.name}</h2>
        </div>
          {(this.state.product.attributes.length === 0) ? <p className="item-page__info__attributes__name">Only one exemplar.</p> : 
          this.state.product.attributes.map((i) => 
          <Attributes 
          key={i.name} 
          attributes={i} 
          setAttribute={setAttribute}
          />)}
          
          <h3 className="item-page__info__price">Price: {this.state.price.currency.symbol + '' + 
          Math.trunc(+this.state.price.amount)}</h3>
          <AddProductButton productInfo={{
            name: this.state.product.name,
            brand: this.state.product.brand,
            prices: this.state.product.prices,
            attributes: this.state.product.attributes,
            pickedAttributes: this.state.pickedAttributes,
            gallery: this.state.product.gallery
          }}/>
          <div className="item-page__info__description" 
          dangerouslySetInnerHTML={{__html: this.state.product.description}}></div>
        </div>
      </main>
    )
  }
}

export default withRouter(ItemPage)