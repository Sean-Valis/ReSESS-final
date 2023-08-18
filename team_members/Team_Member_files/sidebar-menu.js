const sidebarMenu = document.getElementById('sidebar-menu-1');
const pathname = window.location.pathname.split('/');
const currentPage = pathname[pathname.length - 1];

for (let i = 0; sidebarMenu.childElementCount; i++) {		
	const sidebarMenuChildren = sidebarMenu.children[i];
	if (sidebarMenuChildren.children[0].getAttribute('href').includes(currentPage)) {
		// sidebarMenuChildren.classList.add("c-active");
		sidebarMenuChildren.setAttribute('class', 'c-active');
		break;
	}

	if (sidebarMenuChildren.classList.contains('c-dropdown')) {
		const sidebarMenuChildrenDropdown = sidebarMenuChildren.children[1];
		for (let j = 0; j < sidebarMenuChildrenDropdown.childElementCount; j++) {
			if (sidebarMenuChildrenDropdown.children[j].children[0].getAttribute('href').includes(currentPage)) {
				sidebarMenuChildren.classList.add('c-open')
				sidebarMenuChildrenDropdown.children[j].setAttribute('class', 'c-active');
				break;
			}
		}
	}


}