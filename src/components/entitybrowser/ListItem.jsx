/**
 * Default compressed view of an entity
 */
import React from 'react';
import classnames from 'classnames';
import theme from './theme-item.scss';
import ListItemChamel from 'chamel/lib/List/ListItem';
import ListDividerChamel from 'chamel/lib/List/ListDivider';

// Chamel Controls
import Checkbox from 'chamel/lib/Toggle/Checkbox';

/**
 * Module shell
 */
class ListItem extends React.Component {

  shouldComponentUpdate(nextProps) {
    // If we do not have any changes in the nextProps, then we will not proceed with re-rendering the component
    if (
      this.props.entity.getValue("revision") == nextProps.entity.getValue("revision")
      && this.props.selected === nextProps.selected
    ) {
      return false;
    } else {
        return true;
    }
  }

  render() {
    let entity = this.props.entity;
    let headerText = entity.getName();
    let headerTime = entity.getTime(null, true);
    let snippet = entity.getSnippet();
    let actors = entity.getActors();

    // Check if the current entity is unseen, then set the unseen class
    let listItemContainerClass = null;
    if (this.props.entity.getValue("f_seen") === false) {
      listItemContainerClass = classnames(theme.entityBrowserItem, theme.entityBrowserItemUnseen);
    }

    return (
      <div className={listItemContainerClass}>
        <ListItemChamel
          selected={this.props.selected}
          primaryText={headerText}
          secondaryText={snippet}
          onTap={(e) => { this.props.onClick(e)}}
        />
        <ListDividerChamel />
      </div>
    );
  }

};

export default ListItem;
