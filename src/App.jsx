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
  const [filterCategory, setFilterCategory] = useState('All')

  const resetFilters = () => {

  }

  const filterProducts = () => {
    const filteredByName =
      filteredName === 'All'
        ? products
        : products.filter(product => product.users.name === filteredName);

    const filteredByCategory = filterCategory === 'All'
        ? filteredByName
        : filteredByName.filter(product => product.category.title === filterCategory);

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
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  <button
                    data-cy="ClearButton"
                    type="button"
                    className="delete"
                  />
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={filterCategory === 'All'
                      ? "button mr-2 my-1 is-info"
                      : "button mr-2 my-1"
                    }
                onClick={() => setFilterCategory('All')}
              >
                All
              </a>

              {categoriesFromServer.map(category => {
                return (
                  <a
                    data-cy="Category"
                    className={filterCategory === category.title
                      ? "button mr-2 my-1 is-info"
                      : "button mr-2 my-1"
                    }
                    href={`#/${category.title}`}
                    onClick={() => setFilterCategory(category.title)}

                  >
                    {category.title}
                  </a>
                );
              })}

              {/* <a
              data-cy="Category"
              className="button mr-2 my-1"
              href="#/"
            >
              Category 2
            </a> */}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          <p data-cy="NoMatchingMessage">
            No products matching selected criteria
          </p>
          {/* ! */}
          <table
            data-cy="ProductTable"
            className="table is-striped is-narrow is-fullwidth"
          >
            <thead>
              <tr>
                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    ID
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Product
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-down" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Category
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-up" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
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
              {filterProducts().map(product => {
                return (
                  <tr data-cy="Product">
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>
                    <td data-cy="ProductName">{product.name}</td>
                    <td data-cy="ProductCategory">
                      {product.category.icon} - {product.category.title}
                    </td>

                    <td data-cy="ProductUser" className="has-text-link">
                      {product.users.name}
                    </td>
                  </tr>
                );
              })}

              {/* <tr data-cy="Product">
              <td className="has-text-weight-bold" data-cy="ProductId">
                2
              </td>

              <td data-cy="ProductName">Bread</td>
              <td data-cy="ProductCategory">🍞 - Grocery</td>

              <td
                data-cy="ProductUser"
                className="has-text-danger"
              >
                Anna
              </td>
            </tr>

            <tr data-cy="Product">
              <td className="has-text-weight-bold" data-cy="ProductId">
                3
              </td>

              <td data-cy="ProductName">iPhone</td>
              <td data-cy="ProductCategory">💻 - Electronics</td>

              <td
                data-cy="ProductUser"
                className="has-text-link"
              >
                Roma
              </td>
            </tr> */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
