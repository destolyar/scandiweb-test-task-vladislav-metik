import { gql } from '@apollo/client'
import { client } from './apolloClient'

export const getProductsByCategory = (category: string) => {
  return client.query({
    query: gql`
      query getProductsByCategory {
        category(input: {title: "${category}"}) {
          name
          products {
            name
            prices {
              amount
            }
          }
        }
      }
    `
  })
}

export const getAllProducts = () => {
  return client.query({
    query: gql`
      query getAllProducts {
        categories {
          name
          products {
            id
            name
            inStock
            gallery
            description
            category
            brand
            prices {
              currency{
                label
                symbol
              }
              amount
            }
          }
        }
      }
    `
  })
}