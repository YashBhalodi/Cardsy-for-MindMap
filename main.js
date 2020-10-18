miro.onReady(() => {
  const icon =
    '<svg> <rect x="1" y="3" rx="1" ry="1" width="18" height="12" fill-rule="evenodd" fill="#ffffff" stroke="currentColor" stroke-width="2" opacity="1.0"/><rect x="1" y="3" rx="0" ry="1" width="2" height="12" fill-rule="evenodd" fill="currentColor" opacity="1.0" /><rect x="5" y="10" rx="1" ry="1" width="18" height="12" fill-rule="evenodd" fill="#ffffff" stroke="currentColor" stroke-width="2" opacity="1.0"/><rect x="5" y="10" rx="0" ry="1" width="2" height="12" fill-rule="evenodd" fill="currentColor" opacity="1.0" /><rect x="9" y="18" rx="0.5" ry="0.5" width="5" height="2" fill-rule="evenodd" fill="currentColor" opacity="0.3" /><rect x="16" y="18" rx="0.5" ry="0.5" width="5" height="2" fill-rule="evenodd" fill="currentColor" opacity="0.3" /></svg>';

  miro.initialize({
    extensionPoints: {
      getWidgetMenuItems: async (widgets, editmode) => {
        let pluginValid;
        for (const element of widgets) {
          if (element.type === "TEXT") {
            pluginValid = true;
            break;
          }
          pluginValid = false;
        }

        if (pluginValid) {
          return [
            {
              tooltip: "Generate Cards from MindMap",
              svgIcon: icon,
              onClick: async () => {
                const authorized = await miro.isAuthorized();
                if (authorized) {
                  generateCards(widgets);
                } else {
                  miro.board.ui.openModal("not-authorized.html").then((res) => {
                    if (res === "success") {
                      generateCards(widgets);
                    }
                  });
                }
              },
            },
          ];
        } else {
          return [];
        }
      },
    },
  });
});

async function generateCards(selectedWidget) {
  // get selected widgets
  let widgets = await miro.board.selection.get();
  widgets = widgets.filter((item) => (item.type === "TEXT" ? true : false));
  if (widgets.length >= 1) {
    let cards = widgets.map((item) => {
      return {
        title: item.text,
        style: { backgroundColor: item.style.textColor },
        type: "CARD",
        x: item.x + 1500.0,
        y: item.y,
      };
    });
    await miro.board.widgets.create(cards);
    // notify success
    miro.showNotification(`Generated ${cards.length} cards.`);
  } else {
    //exit gracefully
    miro.showNotification("Invalid Selection");
  }
}
