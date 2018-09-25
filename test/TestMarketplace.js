const Marketplace = artifacts.require("Marketplace");

const FINNEY = 10**15;

contract("Marketplace", accounts => {
  const [
    owner,
    seller,
    buyer,
    buyer2,    
    visitor
  ] = accounts;
  let marketplace;
  const item = {
    name: "Shoes",
    description: "Size 10",
    price: 10 * FINNEY,
    imageIpfsHashes: [
      "QmUYnp7zaCwCj4Y5QBwKwRUNTsoY9GHCbrTTvqjaohTre7",
      "QmUYnp7zaCwCj4Y5QBwKwRUNTsoY9GHCbrTTvqjaohTre7"
    ]
  };
  const postItemForSale = async () => {
    await marketplace.addItemForSale(item.name, item.description, item.price, {
      from: seller
    });
    const itemForSaleCount = await marketplace.getItemForSaleCount(seller);
    const itemIndex = itemForSaleCount.toNumber() - 1;
    await marketplace.addImageForItemForSale(itemIndex, item.imageIpfsHashes[0], {
      from: seller
    });
    await marketplace.addImageForItemForSale(itemIndex, item.imageIpfsHashes[1], {
      from: seller
    });
  }
  const getBalance = async account => await web3.eth.getBalance(owner).toNumber() 
  const seedSellerItemsForSaleBy = async (itemsForSaleCountSeed) => {
    for (let index = 0; index < itemsForSaleCountSeed; index++) {
      await postItemForSale();      
    }
  }

  beforeEach(async () => {
    marketplace = await Marketplace.new();
    await marketplace.registerUser(0, "buyer@kingsland.com", "639xxxxxxxxx", {
        from: buyer
      });
    await marketplace.registerUser(1, "seller@kingsland.com", "639xxxxxxxxx", {
        from: seller
      });
  });

  it("does not allow visitors/unregistered to view the seller's contact information", async () => {
    try {
      await marketplace.getSellerContact(seller, { from: visitor });
      assert.fail();
    } catch (err) {
      assert.isOk(true);
    }
  });

  it("allows sellers to add item for sale", async () => {
    await postItemForSale();
    const sellerItemForSaleCountActual = await marketplace.getItemForSaleCount(seller);
    const sellerItemForSaleCountExpected = 1;

    assert.equal(sellerItemForSaleCountActual, sellerItemForSaleCountExpected);
  });

  it("does not allow visitors to add item for sale", async () => {
    try {
      await marketplace.addItemForSale("Shoes", "Size 39", 10 * FINNEY, {
        from: visitor
      });
      assert.fail();
    } catch (err) {
      assert.isOk(true);
    }
  });

  it("does not allow buyers to add item for sale", async () => {
    try {
      await marketplace.addItemForSale("Shoes", "Size 39", 10 * FINNEY, {
        from: buyer
      });
      assert.fail();
    } catch (err) {
      assert.isOk(true);
    }
  });

  it("allows buyers to purchase item", async () => {
    await postItemForSale();
    await marketplace.purchaseItem(seller, 0, {
      from: buyer,
      value: 10 * FINNEY
    });
    const itemBoughtArr = await marketplace.getItemBought(0, {
      from: buyer
    });
    const itemBoughtImageCountBigNum = await marketplace.getItemBoughtImageCount(0, {
      from: buyer
    });
    const itemBoughtImageCount = itemBoughtImageCountBigNum.toNumber();
    const imageIpfsHashes = [];
    for (let index = 0; index < itemBoughtImageCount; index++) {
      const itemBoughtImageIpfsHash = await marketplace.getItemBoughtImage(0, index, {
        from: buyer
      });
      
      imageIpfsHashes.push(itemBoughtImageIpfsHash);
    }


    const itemBoughtActual = {
      name: itemBoughtArr[0],
      description: itemBoughtArr[1],
      price: itemBoughtArr[2].toNumber(),
      imageIpfsHashes
    };
    const itemBoughtExpected = item;

    assert.deepEqual(itemBoughtActual, itemBoughtExpected);
  });

  it("takes 5% commission on every item sold", async () => {
    await postItemForSale();
    await marketplace.purchaseItem(seller, 0, {
      from: buyer,
      value: 10 * FINNEY
    });

    const commissionActual = await marketplace.viewCommission({
      from: owner
    });
    const commissionExpected = item.price * 5 / 100;

    assert.equal(commissionActual.toNumber(), commissionExpected);
  });

  it("allows owner to withdraw commission", async () => {
    await postItemForSale();
    await marketplace.purchaseItem(seller, 0, {
      from: buyer,
      value: 10 * FINNEY
    });

    const ownerBalance = await getBalance(owner);

    await marketplace.cashoutCommission();
    
    const ownerBalanceActual = await getBalance(owner);
    const ownerBalanceExpected = ownerBalance + item.price * 5 / 100;
    
    assert.ok(ownerBalanceActual, ownerBalanceExpected);
  });

  it("allows visitors to view items for sale", async () => {
    const itemsForSaleSeedCount = 2;
    await seedSellerItemsForSaleBy(itemsForSaleSeedCount);
    
    const sellerItemsForSaleCountBigNum = await marketplace.getItemForSaleCount(seller, {
      from: visitor
    });
    const sellerItemsForSaleCount = sellerItemsForSaleCountBigNum.toNumber();

    const sellerItemsForSale = [];
    for (let itemIndex = 0; itemIndex < sellerItemsForSaleCount; itemIndex++) {
      const itemForSaleArr = await marketplace.getItemForSale(seller, itemIndex, {
        from: visitor
      });
      const itemForSaleImageCountBigNum = await marketplace.getItemForSaleImageCount(seller, itemIndex, {
        from: visitor
      });
      const itemForSaleImageCount = itemForSaleImageCountBigNum.toNumber();

      sellerItemsForSale.push({ 
        name: itemForSaleArr[0],
        description: itemForSaleArr[1],
        price: itemForSaleArr[2].toNumber(),
        imageIpfsHashes: []
      });

      for (let imgIndex = 0; imgIndex < itemForSaleImageCount; imgIndex++) {
        const itemForSaleImageIpfsHash = await marketplace.getItemForSaleImage(seller, itemIndex, imgIndex, {
          from: visitor
        });

        sellerItemsForSale[itemIndex].imageIpfsHashes.push(itemForSaleImageIpfsHash);
      }
    }

    const sellerItemsForSaleExpected = [item, item];

    assert.deepEqual(sellerItemsForSale, sellerItemsForSaleExpected);
  });

  it("allows sellers to update their item for sale information", async () => {
    await postItemForSale();
    const newItem = {
      name: "Water bottle",
      description: "1 Liter",
      price: 5 * FINNEY
    };
    await marketplace.updateItemForSale(0, newItem.name, newItem.description, newItem.price, {
      from: seller
    });

    const updatedItemArr = await marketplace.getItemForSale(seller, 0, {
      from: seller
    });
    const updatedItemActual = {
      name: updatedItemArr[0],
      description: updatedItemArr[1],
      price: updatedItemArr[2].toNumber()
    };

    assert.deepEqual(updatedItemActual, newItem);
  });

  it("allows seller to add image for their item for sale", async () => {
    await postItemForSale();
    const itemForSaleImageCountBigNumExpected = await marketplace.getItemForSaleImageCount(seller, 0, {
      from: seller
    });
  
    await marketplace.addImageForItemForSale(0, item.imageIpfsHashes[0], {
      from: seller
    });

    const itemForSaleImageCountBigNumActual = await marketplace.getItemForSaleImageCount(seller, 0, {
      from: seller
    });
    const itemForSaleImageCountActual = itemForSaleImageCountBigNumActual.toNumber();
    const itemForSaleImageCountExpected = itemForSaleImageCountBigNumExpected.toNumber() + 1;

    assert.equal(itemForSaleImageCountActual, itemForSaleImageCountExpected);
  });

  it("allows seller to remove their item for sale", async () => {
    await postItemForSale();
    const itemForSaleCountBigNumExpected = await marketplace.getItemForSaleCount(seller, {
      from: seller
    });
    
    await marketplace.removeItemForSaleBySeller(0, {
      from: seller
    });

    const itemForSaleCountBigNumActual = await marketplace.getItemForSaleCount(seller, {
      from: seller
    });
    const itemForSaleCountActual = itemForSaleCountBigNumActual.toNumber();    
    const itemForSaleCountExpected = itemForSaleCountBigNumExpected.toNumber() - 1;

    assert.equal(itemForSaleCountActual, itemForSaleCountExpected);
  });

  it("allows seller to remove an image for their item for sale", async () => {
    await postItemForSale();
    const itemForSaleImageCountBigNumExpected = await marketplace.getItemForSaleImageCount(seller, 0, {
      from: seller
    });

    await marketplace.removeItemForSaleImage(0, 0, {
      from: seller
    });

    const itemForSaleImageCountBigNumActual = await marketplace.getItemForSaleImageCount(seller, 0, {
      from: seller
    });
    const itemForSaleImageCountActual = itemForSaleImageCountBigNumActual.toNumber();
    const itemForSaleImageCountExpected = itemForSaleImageCountBigNumExpected.toNumber() - 1;

    assert.equal(itemForSaleImageCountActual, itemForSaleImageCountExpected);
  });

  it("allows buyers to view their own purchase history", async () => {
    const sellerItemsForSaleSeedCount = 2;
    await seedSellerItemsForSaleBy(sellerItemsForSaleSeedCount);

    await marketplace.purchaseItem(seller, 0, {
      from: buyer,
      value: 10 * FINNEY
    });
    await marketplace.purchaseItem(seller, 0, {
      from: buyer,
      value: 10 * FINNEY
    });

    const itemsBoughtCountBigNum = await marketplace.itemsBoughtCount({
      from: buyer
    });
    const itemsBoughtCount = itemsBoughtCountBigNum.toNumber();

    const itemsBought = [];
    for (let itemIndex = 0; itemIndex < itemsBoughtCount; itemIndex++) {
      const itemBoughtArr = await marketplace.getItemBought(itemIndex, {
        from: buyer
      });
      const itemBoughtImageCountBigNum = await marketplace.getItemBoughtImageCount(itemIndex, {
        from: buyer
      });
      const itemBoughtImageCount = itemBoughtImageCountBigNum.toNumber();

      itemsBought.push({
        name: itemBoughtArr[0],
        description: itemBoughtArr[1],
        price: itemBoughtArr[2].toNumber(),
        imageIpfsHashes: []
      });

      for (let imgIndex = 0; imgIndex < itemBoughtImageCount; imgIndex++) {
        const imageIpfsHash = await marketplace.getItemBoughtImage(itemIndex, imgIndex, {
          from: buyer
        });

        itemsBought[itemIndex].imageIpfsHashes.push(imageIpfsHash);
      }
    }

    const itemsBoughtExpected = [item, item];

    assert.deepEqual(itemsBought, itemsBoughtExpected);
  });
});