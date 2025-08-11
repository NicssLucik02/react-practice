/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map(product => {
  const category =
    categoriesFromServer.find(categories => categories.id === product.categoryId) ||
    null;

  const users =
    usersFromServer.find(user => user.id === category.ownerId) || null;

  return {
    ...product,
    category,
    users,
  };
});

export const App = () => {
  const [filteredName, setFilteredName] = useState('All');
  const [searchProduct, setSearchProduct] = useState('');
  const [filterCategory, setFilterCategory] = useState([]);
  const [sortStatus, setSortStatus] = useState('');
  const [sortDirection, setSortDirection] = useState({id: 'asc', product: 'asc', category: 'asc', user: 'asc',});

  const resetAllFilters = () => {
    setFilteredName('All');
    setSearchProduct('');
    setFilterCategory([]);
  }

  const sortedProducts = () => {
    let sorted =  [...products];


    if (sortStatus === 'id') {
      sortDirection.id === 'asc'
        ? sorted.sort((a, b) => a.id - b.id)
        : sorted.sort((a, b) => b.id - a.id);

    } else if (sortStatus === 'product') {
      sortDirection.product === 'asc'
        ? sorted.sort((a, b) => a.name.localeCompare(b.name))
        : sorted.sort((a, b) => b.name.localeCompare(a.name))

    } else if (sortStatus === 'category') {
      sortDirection.category === 'asc'
        ? sorted.sort((a, b) => a.category.title.localeCompare(b.category.title))
        : sorted.sort((a, b) => b.category.title.localeCompare(a.category.title))

    } else if (sortStatus === 'user') {
      sortDirection.user === 'asc'
        ? sorted.sort((a, b) => a.users.name.localeCompare(b.users.name))
        : sorted.sort((a, b) => b.users.name.localeCompare(a.users.name))

    }

    return sorted;
  }

  const filterAndSortProducts = () => {
    const sorted = sortedProducts();

    const filteredByName =
      filteredName === 'All'
        ? sorted
        : sorted.filter(product => product.users.name === filteredName);

    const filteredByCategory = filterCategory.length === 0
        ? filteredByName
        : filteredByName.filter(product => filterCategory.includes(product.category.title));

    const searched =
      searchProduct.toLowerCase().trim() === ''
        ? filteredByCategory
        : filteredByCategory.filter(product =>
          product.name.toLowerCase().includes(searchProduct.toLowerCase())
        );

    return searched;
  };

  const handleSearch = event => {
    setSearchProduct(event.target.value);
  };

  const handleSortId = () => {
    setSortStatus('id')
    setSortDirection((prev => ({
      ...prev,
       id: prev.id === 'asc' ? 'desc' : 'asc'
    })))
  }

    const handleSortProduct = () =>{
    setSortStatus('product')
    setSortDirection((prev => ({
      ...prev,
       product: prev.product === 'asc' ? 'desc' : 'asc'
    })))
  }

  const handleSortCategory = () => {
    setSortStatus('category')
    setSortDirection((prev => ({
      ...prev,
       category: prev.category === 'asc' ? 'desc' : 'asc'
    })))
  }

  const handleSortUser = () => {
    setSortStatus('user')
    setSortDirection((prev => ({
      ...prev,
       user: prev.user === 'asc' ? 'desc' : 'asc'
    })))
  }

  const handleFilterCategory = (event) => {
  event.preventDefault();
  const categoryTitle = event.currentTarget.textContent;

  setFilterCategory(prev =>
    prev.includes(categoryTitle)
      ? prev.filter(title => title !== categoryTitle)
      : [...prev, categoryTitle]
  );
};


console.log(filterCategory)

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/All"
                className={filteredName === 'All' && 'is-active'}
                onClick={() => setFilteredName('All')}
              >
                All
              </a>

              {usersFromServer.map(user => {
                return (
                  <a
                    key={user.id}
                    data-cy="FilterUser"
                    href={`#/${user.name}`}
                    className={filteredName === `${user.name}` && 'is-active'}
                    onClick={() => setFilteredName(user.name)}
                  >
                    {user.name}
                  </a>
                );
              })}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={searchProduct}
                  onChange={handleSearch}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {searchProduct !== ''
                  ? <button
                    data-cy="ClearButton"
                    type="button"
                    className="delete"
                    onClick={() => setSearchProduct('')}
                  />
                  : ''
                  }

                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={filterCategory.length === 0
                      ? "button mr-2 my-1 is-info"
                      : "button mr-2 my-1"
                    }
                 onClick={(e) => {
                e.preventDefault();
                setFilterCategory([]);
                }}
              >
                All
              </a>

              {categoriesFromServer.map(category => {
                return (
                  <a
                    key = {category.id}
                    data-cy="Category"
                    className={filterCategory.includes(category.title)
                      ? "button mr-2 my-1 is-info"
                      : "button mr-2 my-1"
                    }
                    href={`#/${category.title}`}
                    onClick={handleFilterCategory}

                  >
                    {category.title}
                  </a>
                );
              })}

            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={resetAllFilters}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          <p data-cy="NoMatchingMessage">
            {filterAndSortProducts.length < 0 ? 'No products matching selected criteria' : '' }
          </p>

          <table
            data-cy="ProductTable"
            className="table is-striped is-narrow is-fullwidth"
          >
            <thead>
              <tr>
                <th>
                  <span className="is-flex is-flex-wrap-nowrap" onClick={handleSortId}>
                    ID
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap" onClick={handleSortProduct}>
                    Product
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-down" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap" onClick={handleSortCategory}>
                    Category
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-up" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap" onClick={handleSortUser}>
                    User
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>
              </tr>
            </thead>

            <tbody>
              {filterAndSortProducts().map(product => {
                return (
                  <tr data-cy="Product" key={product.id}>
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>
                    <td data-cy="ProductName">{product.name}</td>
                    <td data-cy="ProductCategory">
                      {product.category.icon} - {product.category.title}
                    </td>

                    <td data-cy="ProductUser" className={product.users.sex === 'm' ? 'has-text-link' : 'has-text-danger'}>
                      {product.users.name}
                    </td>
                  </tr>
                );
              })}

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
