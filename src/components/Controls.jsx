import AppBar from 'chamel/lib/AppBar';
import AutoComplete from 'chamel/lib/AutoComplete/AutoComplete';
import Checkbox from 'chamel/lib/Toggle/Checkbox';
import CircularProgress from 'chamel/lib/Progress/CircularProgress';
import DatePicker from 'chamel/lib/Picker/DatePicker';
import Dialog from 'chamel/lib/Dialog/Dialog';
import Drawer from 'chamel/lib/Drawer';
import DropDownIcon from 'chamel/lib/DropDownIcon';
import DropDownMenu from 'chamel/lib/Picker/SelectField';
import Editor from 'chamel/lib/Editor/Editor';
import FloatingButton from 'chamel/lib/Button/FloatingButton';
import FlatButton from 'chamel/lib/Button/FlatButton';
import FontIcon from 'chamel/lib/FontIcon';
import GridContainer from 'chamel/lib/Grid/Container';
import GridRow from 'chamel/lib/Grid/Row';
import GridColumn from 'chamel/lib/Grid/Column';
import IconButton from 'chamel/lib/Button/IconButton';
import LinearProgress from 'chamel/lib/Progress/LinearProgress';
import ListItem from 'chamel/lib/List/ListItem';
import Menu from 'chamel/lib/Menu/Menu';
import MenuItem from 'chamel/lib/Menu/MenuItem';
import NestedMenuItem from 'chamel/lib/Menu/NestedMenuItem';
import Paper from 'chamel/lib/Paper/Paper';
import Popover from 'chamel/lib/Popover/Popover';
import RadioButton from 'chamel/lib/Picker/RadioButton';
import RadioButtonGroup from 'chamel/lib/Picker/RadioPicker';
import RadioPicker from 'chamel/lib/Picker/RadioPicker';
import RaisedButton from 'chamel/lib/Button/RaisedButton';
import Snackbar from 'chamel/lib/Snackbar/Snackbar';
import SelectField from 'chamel/lib/Picker/SelectField';
import SelectButton from 'chamel/lib/Picker/SelectButton';
import SvgIcon from 'chamel/lib/svg-icons/svg-icon';
import Tab from 'chamel/lib/Tabs/Tab';
import Tabs from 'chamel/lib/Tabs/Tabs';
import TextField from 'chamel/lib/Input/TextField';
import TextFieldRich from 'chamel/lib/TextFieldRich/TextFieldRich';
import Toggle from 'chamel/lib/Toggle/Switch';
import Toolbar from 'chamel/lib/Toolbar/Toolbar';
import ToolbarGroup from 'chamel/lib/Toolbar/ToolbarGroup';

// Icons
import AccessTimeIcon from 'chamel/lib/icons/font/AccessTimeIcon';
import AccessibilityIcon from 'chamel/lib/icons/font/AccessibilityIcon';
import AccountIcon from 'chamel/lib/icons/font/AccountIcon';
import AddIcon from 'chamel/lib/icons/font/AddIcon';
import AddCircleIcon from 'chamel/lib/icons/font/AddCircleIcon';
import AnnouncementIcon from 'chamel/lib/icons/font/AnnouncementIcon';
import AppsIcon from 'chamel/lib/icons/font/AppsIcon';
import ArrowBackIcon from 'chamel/lib/icons/font/ArrowBackIcon';
import ArrowDownIcon from 'chamel/lib/icons/font/ArrowDownIcon';
import ArrowDropDownIcon from 'chamel/lib/icons/font/ArrowDropDownIcon';
import ArrowDropDownCircleIcon from 'chamel/lib/icons/font/ArrowDropDownCircleIcon';
import ArrowDropUpIcon from 'chamel/lib/icons/font/ArrowDropUpIcon';
import ArrowForwardIcon from 'chamel/lib/icons/font/ArrowForwardIcon';
import ArrowRightIcon from 'chamel/lib/icons/font/ArrowRightIcon';
import ArrowUpIcon from 'chamel/lib/icons/font/ArrowUpIcon';
import AttachmentIcon from 'chamel/lib/icons/font/AttachmentIcon';
import AttachFileIcon from 'chamel/lib/icons/font/AttachFileIcon';
import BoldIcon from 'chamel/lib/icons/font/BoldIcon';
import BorderColorIcon from 'chamel/lib/icons/font/BorderColorIcon';
import BuildIcon from 'chamel/lib/icons/font/BuildIcon';
import CancelIcon from 'chamel/lib/icons/font/CancelIcon';
CheckIcon
import CheckCircleIcon from 'chamel/lib/icons/font/CheckCircleIcon';
import ChevronLeftIcon from 'chamel/lib/icons/font/ChevronLeftIcon';
import ChevronRightIcon from 'chamel/lib/icons/font/ChevronRightIcon';
import CloseIcon from 'chamel/lib/icons/font/CloseIcon';
import CodeIcon from 'chamel/lib/icons/font/CodeIcon';
import CommentIcon from 'chamel/lib/icons/font/CommentIcon';
import ContactsIcon from 'chamel/lib/icons/font/ContactsIcon';
import ContentPaste from 'chamel/lib/icons/font/ContentPaste';
import DashboardIcon from 'chamel/lib/icons/font/DashboardIcon';
import DateRangeIcon from 'chamel/lib/icons/font/DateRangeIcon';
import DeleteIcon from 'chamel/lib/icons/font/DeleteIcon';
import EditIcon from 'chamel/lib/icons/font/EditIcon';
import EmailIcon from 'chamel/lib/icons/font/EmailIcon';
import ExpandLessIcon from 'chamel/lib/icons/font/ExpandLessIcon';
import ExpandMoreIcon from 'chamel/lib/icons/font/ExpandMoreIcon';
import FilterListIcon from 'chamel/lib/icons/font/FilterListIcon';
import FindPageIcon from 'chamel/lib/icons/font/FindPageIcon';
import FirstPageIcon from 'chamel/lib/icons/font/FirstPageIcon';
import FlagIcon from 'chamel/lib/icons/font/FlagIcon';
import FullScreenIcon from 'chamel/lib/icons/font/FullScreenIcon';
import FullScreenExitIcon from 'chamel/lib/icons/font/FullScreenExitIcon';
import GroupIcon from 'chamel/lib/icons/font/GroupIcon';
import InboxIcon from 'chamel/lib/icons/font/InboxIcon';
import ItalicIcon from 'chamel/lib/icons/font/ItalicIcon';
import LabelIcon from 'chamel/lib/icons/font/LabelIcon';
import LastPageIcon from 'chamel/lib/icons/font/LastPageIcon';
import LibraryBooksIcon from 'chamel/lib/icons/font/LibraryBooksIcon';
import LinkIcon from 'chamel/lib/icons/font/LinkIcon';
import ListNumberedIcon from 'chamel/lib/icons/font/ListNumberedIcon';
import ListBulletedIcon from 'chamel/lib/icons/font/ListBulletedIcon';
import LocalOfferIcon from 'chamel/lib/icons/font/LocalOfferIcon';
import MenuIcon from 'chamel/lib/icons/font/MenuIcon';
import MergeIcon from 'chamel/lib/icons/font/MergeIcon';
import MoreHorizIcon from 'chamel/lib/icons/font/MoreHorizIcon';
import MoreVertIcon from 'chamel/lib/icons/font/MoreVertIcon';
import NoteIcon from 'chamel/lib/icons/font/NoteIcon';
import PersonAddIcon from 'chamel/lib/icons/font/PersonAddIcon';
import PhotoIcon from 'chamel/lib/icons/font/PhotoIcon';
import PhotoCameraIcon from 'chamel/lib/icons/font/PhotoCameraIcon';
import PrintIcon from 'chamel/lib/icons/font/PrintIcon';
import RefreshIcon from 'chamel/lib/icons/font/RefreshIcon';
import SaveIcon from 'chamel/lib/icons/font/SaveIcon';
import SearchIcon from 'chamel/lib/icons/font/SearchIcon';
import SendIcon from 'chamel/lib/icons/font/SendIcon';
import SettingsIcon from 'chamel/lib/icons/font/SettingsIcon';
import SettingsApplication from 'chamel/lib/icons/font/SettingsApplication';
import ShuffleIcon from 'chamel/lib/icons/font/ShuffleIcon';
import StreetViewIcon from 'chamel/lib/icons/font/StreetViewIcon';
import StyleIcon from 'chamel/lib/icons/font/StyleIcon';
import SubArrowLeftIcon from 'chamel/lib/icons/font/SubArrowLeftIcon';
import SubArrowRightIcon from 'chamel/lib/icons/font/SubArrowRightIcon';
import SwapHorizIcon from 'chamel/lib/icons/font/SwapHorizIcon';
import TitleIcon from 'chamel/lib/icons/font/TitleIcon';
import TransformIcon from 'chamel/lib/icons/font/TransformIcon';
import WebIcon from 'chamel/lib/icons/font/WebIcon';
import ViewListIcon from 'chamel/lib/icons/font/ViewListIcon';
import WorkIcon from 'chamel/lib/icons/font/WorkIcon';
import UnderlinedIcon from 'chamel/lib/icons/font/UnderlinedIcon';

// SVG Icons
import NavigationMenu from 'chamel/lib/svg-icons/navigation-menu';
import NavigationChevronLeft from 'chamel/lib/svg-icons/navigation-chevron-left';
import NavigationChevronRight from 'chamel/lib/svg-icons/navigation-chevron-right';

// Utils
import CssEvent from 'chamel/lib//utils/CssEvent';
import Dom from 'chamel/lib//utils/Dom';
import Events from 'chamel/lib//utils/Events';
import KeyCode from 'chamel/lib//utils/KeyCode';
import KeyLine from 'chamel/lib//utils/KeyLine';

// Theme
import materialTheme from 'chamel/lib/styles/theme/material';
import chamelThemeService from 'chamel/lib/styles/ChamelThemeService';

// Set the default theme
chamelThemeService.defaultTheme = materialTheme;

// Export application icons
const Icons = {
  NavigationMenu,
  NavigationChevronLeft,
  NavigationChevronRight,
  AccessTimeIcon,
  AccessibilityIcon,
  AccountIcon,
  AddIcon,
  AddCircleIcon,
  AnnouncementIcon,
  AppsIcon,
  ArrowBackIcon,
  ArrowDownIcon,
  ArrowDropDownIcon,
  ArrowDropDownCircleIcon,
  ArrowDropUpIcon,
  ArrowForwardIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  AttachmentIcon,
  AttachFileIcon,
  BoldIcon,
  BorderColorIcon,
  BuildIcon,
  CancelIcon,
  CheckIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  CodeIcon,
  CommentIcon,
  ContactsIcon,
  ContentPaste,
  DashboardIcon,
  DateRangeIcon,
  DeleteIcon,
  EditIcon,
  EmailIcon,
  ExpandLessIcon,
  ExpandMoreIcon,
  FilterListIcon,
  FindPageIcon,
  FirstPageIcon,
  FlagIcon,
  FullScreenIcon,
  FullScreenExitIcon,
  GroupIcon,
  InboxIcon,
  ItalicIcon,
  LabelIcon,
  LastPageIcon,
  LibraryBooksIcon,
  LinkIcon,
  ListNumberedIcon,
  ListBulletedIcon,
  LocalOfferIcon,
  MenuIcon,
  MergeIcon,
  MoreHorizIcon,
  MoreVertIcon,
  NoteIcon,
  PersonAddIcon,
  PhotoCameraIcon,
  PhotoIcon,
  PrintIcon,
  RefreshIcon,
  SaveIcon,
  SearchIcon,
  SendIcon,
  SettingsIcon,
  SettingsApplication,
  ShuffleIcon,
  StreetViewIcon,
  StyleIcon,
  SubArrowLeftIcon,
  SubArrowRightIcon,
  SwapHorizIcon,
  TitleIcon,
  TransformIcon,
  WebIcon,
  ViewListIcon,
  WorkIcon,
  UnderlinedIcon
};

/**
 * We do this to make it easier to switch out UI frameworks.
 *
 * Right now we use chamel but later we may just want to render
 * our own controls (button, tab, etc)
 */
export default {
  AppBar,
  AutoComplete,
  Checkbox,
  DatePicker,
  Dialog,
  SelectField,
  SelectButton,
  DropDownIcon,
  DropDownMenu,
  Editor,
  FlatButton,
  FontIcon,
  IconButton,
  Drawer,
  Menu,
  MenuItem,
  NestedMenuItem,
  ListItem,
  Paper,
  Popover,
  RadioButton,
  RadioPicker,
  RaisedButton,
  FloatingButton,
  LinearProgress,
  CircularProgress,
  SvgIcon,
  Icons,
  Tab,
  Tabs,
  Toggle,
  Snackbar,
  TextField,
  TextFieldRich,
  Toolbar,
  ToolbarGroup,
  Utils: {
    CssEvent,
    Dom,
    Events,
    KeyCode,
    KeyLine
  },
  Grid: {
    Container: GridContainer,
    Row: GridRow,
    Column: GridColumn
  }
};
