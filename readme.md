
# FameLady

## Using the Subgraph

contract address: 0xf3E6DbBE461C6fa492CeA7Cb1f5C5eA660EB1B47

[Contract, etherscan link](https://etherscan.io/token/0xf3e6dbbe461c6fa492cea7cb1f5c5ea660eb1b47)

You can query this subgraph [here](https://api.thegraph.com/subgraphs/name/crysis1201/famelady)

### Sample query

```javascript
{
  ladies(first: 5) {
    id
    lastOwner
    description
    tokenID
  }
  users(first: 5) {
    id
    Ladies {
      id
    }
  }
}
```

### Front End Usage
```javascript
const main = async() => {
    const result = await axois.post(
        "https://api.thegraph.com/subgraphs/name/crysis1201/famelady", 
        {
            query: `{
                {
                    ladies(first: 5) {
                        id
                        lastOwner
                        description
                        tokenID
                    }
                    users(first: 5) {
                        id
                        Ladies {
                        id
                        }
                    }
                }
            }`
        }
    )
}
```
