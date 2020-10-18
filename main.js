miro.onReady(() => {
  const icon =
    '<svg width="32" height="32" xmlns="http://www.w3.org/2000/svg"><g><title>background</title><rect fill="#fff" id="canvas_background" height="34" width="34" y="-1" x="-1"/><g display="none" overflow="visible" y="0" x="0" height="100%" width="100%" id="canvasGrid"><rect fill="url(#gridpattern)" stroke-width="0" y="0" x="0" height="100%" width="100%"/></g></g><g><title>Layer 1</title><g stroke="null" id="svg_14"><ellipse stroke="null" ry="3.05005" rx="4.53696" id="svg_1" cy="12.27248" cx="12.91274" stroke-width="0.5" fill="#cccccc"/><ellipse stroke="null" ry="3.05005" rx="4.53696" id="svg_2" cy="4.64735" cx="19.61955" stroke-width="0.5" fill="#cccccc"/><ellipse stroke="null" ry="3.05005" rx="4.53696" id="svg_3" cy="4.7708" cx="6.4511" stroke-width="0.5" fill="#cccccc"/><ellipse stroke="null" ry="3.05005" rx="4.53696" id="svg_4" cy="20.27887" cx="6.30174" stroke-width="0.5" fill="#cccccc"/><ellipse stroke="null" ry="3.05005" rx="4.53696" id="svg_5" cy="20.5984" cx="20.16342" stroke-width="0.5" fill="#cccccc"/><line stroke="#b2b2b2" stroke-linecap="null" stroke-linejoin="null" id="svg_6" y2="6.8532" x2="7.96577" y1="9.69628" x1="9.92709" stroke-width="0.5" fill="none"/><line stroke="#b2b2b2" stroke-linecap="null" stroke-linejoin="null" id="svg_8" y2="7.16909" x2="18.01753" y1="10.01218" x1="16.05621" stroke-width="0.5" fill="none"/><line stroke="#b2b2b2" stroke-linecap="null" stroke-linejoin="null" id="svg_9" y2="17.90963" x2="8.94643" y1="15.06655" x1="10.90775" stroke-width="0.5" fill="none"/><line stroke="#b2b2b2" stroke-linecap="null" stroke-linejoin="null" id="svg_10" y2="17.90963" x2="18.01753" y1="14.75065" x1="15.07555" stroke-width="0.5" fill="none"/><rect stroke="#007fff" id="svg_11" height="11.05644" width="18.14219" y="19.48912" x="12.37874" fill-opacity="null" stroke-width="0.5" fill="none"/><rect stroke="null" id="svg_12" height="2.21129" width="4.65813" y="25.80709" x="14.58522" stroke-width="0.5" fill="#0000ff"/><rect stroke="null" id="svg_13" height="2.21129" width="4.65813" y="25.80709" x="21.20467" stroke-width="0.5" fill="#0000ff"/></g></g></svg>';

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
