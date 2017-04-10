/**
 * Render an entity browser list
 */
import React from 'react';
import theme from './theme.scss';
import ReactDOM from 'react-dom';
import ListItem from './ListItem.jsx';
import ListItemTableRow from './ListItemTableRow';
import Loading from '../Loading';
import CommentItem from './item/Comment';
import ActivitytItem from './item/Activity';
import StatusUpdateItem from './item/StatusUpdate';
import WorkflowActionItem from './item/WorkflowAction';
import ListChamel from 'chamel/lib/List/List';
import InfiniteScroll from '../utils/InfiniteScroll';

/**
 * Component that will render an entity browser list based entity's objType
 */
class List extends React.Component {

  static propTypes = {

    /**
     * Callback function that is called when an entity in the list is clicked
     */
    onEntityListClick: React.PropTypes.func,

    /**
     * Callback function that is called when selecting an entity
     */
    onEntityListSelect: React.PropTypes.func,

    /**
     * Callback function that is called when loading more entities
     */
    onLoadMoreEntities: React.PropTypes.func,

    /**
     * Callback function that is called when creating a new entity
     */
    onCreateNewEntity: React.PropTypes.func,

    /**
     * Callback function that is called when removing an entity
     */
    onRemoveEntity: React.PropTypes.func,

    /**
     * The type of layout we will use to display the list.
     */
    layout: React.PropTypes.string,

    /**
     * The entities that will be displayed in the list
     */
    entities: React.PropTypes.array,

    /**
     * Flag that will determine if the collection is still loading
     */
    collectionLoading: React.PropTypes.bool,

    /**
     * The array of selected entities
     */
    selectedEntities: React.PropTypes.array,

    /**
     * The browser view data that will be used to define the columns of the list
     */
    browserViewData: React.PropTypes.object,

    /**
     * The filters used to display this entity browser list
     */
    filters: React.PropTypes.array,

    /**
     * The total number of entities
     */
    entitiesTotalNum: React.PropTypes.number
  };

  shouldComponentUpdate(nextProps) {

    // If the collection is still loading, then we do not need to update the list component for now
    if (nextProps.collectionLoading) {
      return false;
    } else {
      return true;
    }
  };

  /**
   * Class constructor
   *
   * @param {Object} props Properties to send to the render function
   */
  constructor(props) {
    // Call parent constructor
    super(props);
  };

  /**
   * Render our component
   *
   * @returns {Object} React component
   */
  render() {

    // Loop thru the entities and get the entity items to display in the list
    let entityNodes = [];
    if (this.props.entities) {
      this.props.entities.forEach((entity) => {
        entityNodes.push(this.getEntityItem(entity));
      })
    }

    const hasMore = (this.props.entities.length < this.props.entitiesTotalNum) ? true : false;
    if (this.props.layout === 'table') {
      return (
        <div className={theme.entityBrowserList}>
          <InfiniteScroll
            pageStart={0}
            threshold={50}
            hasMore={hasMore}
            loader={<Loading />}
            loadMore={(pageLoaded) => {
                this.props.onLoadMoreEntities(pageLoaded);
            }}>
              <table className={theme.entityBrowserListTable}>
                <tbody>
                  {entityNodes}
                </tbody>
              </table>
          </InfiniteScroll>
        </div>
      );
    }

    return (
      <InfiniteScroll
        pageStart={0}
        threshold={50}
        hasMore={hasMore}
        loader={<Loading className="scroll-loading" />}
        loadMore={(pageLoaded) => {
            this.props.onLoadMoreEntities(pageLoaded);
        }}>
          <ListChamel>
            {entityNodes}
          </ListChamel>
      </InfiniteScroll>
    )
  };

  /**
   * Determine which item component to display based on the entity's objType
   * @param {Entity} entity The entity we will be displaying in the list
   */
  getEntityItem = (entity) => {
    const selected = (this.props.selectedEntities.indexOf(entity.id) != -1);

    switch (entity.objType) {
      case "activity":
        return (
          <ActivitytItem
            key={entity.id}
            entity={entity}
            filters={this.props.filters}
            onRemoveEntity={this.props.onRemoveEntity}
            onEntityListClick={this.props.onEntityListClick}
          />
        )
        break;

      case "comment":
        return (
          <CommentItem
            key={entity.id}
            selected={selected}
            entity={entity}
            onRemoveEntity={this.props.onRemoveEntity}
            onClick={() => {
              this.props.onEntityListClick(entity.objType, entity.id, entity.getName());
            }}
            onSelect={() => {
              this.props.onEntityListSelect(entity.id);
            }}
          />
        );
        break;

      case "status_update":
        return (
          <StatusUpdateItem
            key={entity.id}
            entity={entity}
            onRemoveEntity={this.props.onRemoveEntity}
            onEntityListClick={this.props.onEntityListClick}
          />
        );
        break;

      case "workflow_action":
        return (
          <WorkflowActionItem
            key={entity.id}
            entity={entity}
            onCreateNewEntity={this.props.onCreateNewEntity}
            onRemoveEntity={this.props.onRemoveEntity}
            onEntityListClick={this.props.onEntityListClick}
          />
        );
        break;

      /*
       * All other object types will either be displayed as a table row
       * for large devices or a regular detailed item for small or preview mode.
       */
      default:
        if (this.props.layout === 'table') {
          return (
            <ListItemTableRow
              key={entity.id}
              selected={selected}
              entity={entity}
              browserViewData={this.props.browserViewData}
              onRemoveEntity={this.props.onRemoveEntity}
              onClick={() => {
                this.props.onEntityListClick(entity.objType, entity.id, entity.getName());
              }}
              onSelect={() => {
                this.props.onEntityListSelect(entity.id);
              }}
            />
          );
        } else {
          return (
            <ListItem
              key={entity.id}
              selected={selected}
              entity={entity}
              onRemoveEntity={this.props.onRemoveEntity}
              onClick={() => {
                this.props.onEntityListClick(entity.objType, entity.id, entity.getName());
              }}
              onSelect={() => {
                this.props.onEntityListSelect(entity.id);
              }}
            />
          );
        }
        break;
    }
  }
}

export default List;
