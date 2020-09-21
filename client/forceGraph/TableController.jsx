import React, { useEffect, useState } from 'react';
import { state } from '../App';
import { useRecoilState } from 'recoil';


const TableController = () => {
  const [data, setData] = useRecoilState(state);

  const startTable = (event) => {
    console.log('123')
    const table = {
      name: event.target.value,
      expenses: [],
      total: 0,
    }
    // this.setState({tableBeingAdded: table});
  }

  const clearTable = (event) => {
    console.log('456')
    event.target.value = '';
    event.target.blur();
    // this.setState({tableBeingAdded: null});
  }

  const addTable = (event) => {
    console.log('789')
    const ENTER_CODE = 13;
    const ESC_CODE = 27;
    if (event.keyCode === ESC_CODE) {
      clearTable(event);
    } else if (event.keyCode === ENTER_CODE) {
      // take the value of the input and create new table
      const newTableName = event.target.value;
      const originalTables = data.tables;

      if (!originalTables[newTableName]) { // if this new table is not in original tables obj
        const newTables = {...originalTables} // make a copy of originalTables
        newTables[newTableName] = {
          primaryKey: '_id', // TBD
          foreignKeys: {}, // TBD
          referencedBy: {}, // TBD
          columns: {}, // TBD
        }
        setData({...data, tables: newTables, tableModified: true})
        console.log('999')
      }

      // clear out the input form on successful submit
      event.target.value = '';
      event.target.blur();

    }
  }

  const deleteTable = (table) => {
    const tables = this.state.tables.filter(d => d.name !== table.name);
    // this.setState({tables});
  }

  return (<div style={{ position: 'fixed', bottom: '5vh', left: '3vw', zIndex: '10'}}>
  <h5 style={{textAlign: 'center', color: 'black'}}>Add a Table</h5>
  <input id='addTable' type='text' placeholder='Add Table' onFocus={startTable} onBlur={clearTable} onKeyDown={addTable}></input>
  
  <h5 style={{textAlign: 'center', color: 'black'}}>Add a relation</h5>
  <input id='addRelation' type='text' placeholder='Add a Relation'></input>
  <h5 style={{textAlign: 'center', color: 'black'}}>Delete a relation</h5>
  <input id='deleteRelation' type='text' placeholder='Delete a Relation'></input>
  </div>)
}

export default TableController;