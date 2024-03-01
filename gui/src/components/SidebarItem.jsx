const SidebarItem = (props) => {
   const selected = props.selected === props.name ? 'selected' : '';
   return (
      <div 
         id={selected} 
         className="fs-4 border rounded p-2 mb-3 d-flex flex-left align-items-center sidebar-nav-item sidebar-link"
         onClick={() => props.setSelected(props.name)}
      >
         { props.children }
         <span className="ms-2">{props.name}</span>
      </div>
   );
};

export default SidebarItem;