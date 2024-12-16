import {useEffect, useRef, useState} from "preact/hooks";
import {showSongEditPanel} from "@stores/global";
import {useStoreState} from "@/utils/hooks";
import {$RvW} from "@/rvw";
import Modal from "@app/ui/widgets/Modal";

const INNER_HTML = `
<div class="ui grid vvrow">
  <div class="eight wide column">
    <div class="form-group row">
      <label for="songEdit_NameID" class="col-sm col-form-label">Title</label>
      <div class="col-sm">
        <input type="text" class="form-control form-control-sm" id="songEdit_NameID" placeholder="Song Title">
      </div>
    </div>
  </div>
  <div class="six wide column">
    <div class="form-group row">
      <label for="songEdit_Name2ID" class="col-sm col-form-label">Title 2</label>
      <div class="col-sm">
        <input type="text" class="form-control form-control-sm" id="songEdit_Name2ID"
          placeholder="Alternate Song Title">
      </div>
    </div>
  </div>
  <div class="two wide column">
    <div class="form-group row">
      <label for="songEdit_SongNumberID" class="col-sm col-form-label">#</label>
      <div class="col-sm">
        <input type="text" class="form-control form-control-sm" id="songEdit_SongNumberID"
          placeholder="Song Number" readonly>
      </div>
    </div>
  </div>
</div>

<!-- **** CATEGORY **** -->
<div class="ui grid vvrow30">
  <div class="four wide column">
    <label for="songnav_category2" class="col-form-label">Category</label>
  </div>

  <div class="six wide column">
    <div class="form-group">
      <select class="form-control" id="songnav_category2"></select>
    </div>
  </div>

  <div class="one wide column">
    <button type="button" class="btn btn-secondary btn-sm" id="songEdit_addCatButtonID">+</button>
  </div>

  <div class="three wide column">
    <input type="text" class="form-control form-control-sm" id="se_catTextID" placeholder="New Category">
  </div>

  <div class="one wide column">
    <button type="button" class="btn btn-secondary btn-sm" id="se_submitCatButtonID2">OK</button>
  </div>
</div>

<!-- **** FONTS **** -->
<div class="ui grid vvrow30">
  <div class="four wide column">
    <div class="form-group">
      <label for="se_fontID2">Primary Font</label>
    </div>
  </div>

  <div class="six wide column">
    <div class="form-group">
      <select class="form-control" id="se_fontID2"></select>
    </div>
  </div>

  <div class="one wide column">
    <button type="button" class="btn btn-secondary btn-sm" id="se_addFontButtonID2">+</button>
  </div>

  <div class="three wide column">
    <input type="text" class="form-control form-control-sm" id="se_fontTextID" placeholder="New Font Name">
  </div>

  <div class="one wide column">
    <button type="button" class="btn btn-secondary btn-sm" id="se_submitFontButtonID2">OK</button>
  </div>
</div>

<!-- **** SECONDARY FONTS **** -->
<div class="ui grid vvrow40">
  <div class="four wide column">
    <div class="form-group">
      <label for="se_fontID2_2">Secondary Font</label>
    </div>
  </div>
  <div class="six wide column">
    <div class="form-group">
      <select class="form-control" id="se_fontID2_2"></select>
    </div>
  </div>
</div>

<!-- **** KEY, COPYRIGHT, YouTUBE **** -->
<div class="ui grid">
  <div class="two wide column">
    <div class="form-group">
      <label for="se_keyID">Key</label>
      <input type="text" class="form-control form-control-sm" id="se_keyID" placeholder="Key">
    </div>
  </div>
  <div class="six wide column">
    <div class="form-group">
      <label for="se_copyrightID">Lyrics By</label>
      <input type="text" class="form-control form-control-sm" id="se_copyrightID" placeholder="Author">
    </div>
  </div>
  <div class="eight wide column">
    <div class="form-group">
      <label for="se_yvideoID">YouTube Link</label>
      <input type="text" class="form-control form-control-sm" id="se_yvideoID"
        placeholder="Example: https://www.youtube.com/watch?v=COQ6cni_TG8">
    </div>
  </div>
</div>

<div class="ui grid">
  <div id="se_slides" class="style2"></div><br>
</div>

<div class="ui grid vvrow">
  <div class="nine wide column">
    <div class="form-group">
      <button type="button" class="btn btn-dark btn-sm" id="songEdit_moveSlideLeftButtonID">&lt;</button>
      <button type="button" class="btn btn-dark btn-sm" id="songEdit_moveSlideRightButtonID">&gt;</button>
      <button type="button" class="btn btn-primary btn-sm" id="songEdit_addSlideButtonID">ADD</button>
      <button type="button" class="btn btn-primary btn-sm" id="songEdit_dupSlideButtonID">DUPLICATE</button>
      <button type="button" class="btn btn-primary btn-sm" id="songEdit_deleteSlideButtonID">DELETE</button>
      <button type="button" class="btn btn-primary btn-sm" id="songEdit_createSlidesButtonID">CREATE</button>
    </div>
  </div>
  <div class="two wide column">
    <label for="se_sequenceID" class="invisible">Sequence</label>
  </div>
  <div class="five wide column">
    <input type="text" class="form-control form-control-sm invisible" id="se_sequenceID" placeholder="1,2,3,2,4,2">
  </div>
</div>

<div class="ui grid">
  <div class="one wide column">
    <div class="form-group">
      <label for="se_notesID">Notes</label>
    </div>
  </div>
  <div class="eight wide column">
    <div class="form-group">
      <textarea class="form-control form-control-sm" id="se_notesID" rows="1"></textarea>
    </div>
  </div>

  <div class="one wide column">
  </div>

  <div class="one wide column">
    <div class="form-group">
      <label for="se_notesID">Tags</label>
    </div>
  </div>
  <div class="five wide column">
    <div class="form-group">
      <textarea class="form-control form-control-sm" id="se_tagID" rows="1" placeholder="Worship,Slow"></textarea>
    </div>
  </div>
</div>
`;

export default function SongEditDialog() {
    const container = useRef<HTMLDivElement>(null);

    const open = useStoreState(showSongEditPanel);

    const [panel, setPanel] = useState(null);

    useEffect(() => {
        const panel = new $Y.Panel({
            headerContent   : 'Song ADD / EDIT',
            srcNode         : container.current!,
            width           : "602px",
            height          : 'auto',
            zIndex          : 10,
            centered        : true,
            modal           : true,
            render          : true,
            visible         : false, // make visible explicitly with .show()
            buttons         : {
                header      : ['close'],
                footer      : [
                    {
                        name  : 'present',
                        label : 'Present',
                        isDefault: true,
                        action: (e: any) => {
                            e.preventDefault();
                            $RvW.songEditObj.onPresent();
                        },
                    },
                    {
                        name  : 'save',
                        label : 'Save',
                        isDefault: true,
                        action: (e: any) => {
                            e.preventDefault();
                            $RvW.songEditObj.onSave();
                        },
                    },
                    {
                        name  : 'save-as-new',
                        label : 'Save As New',
                        action: (e: any) => {
                            e.preventDefault();
                            $RvW.songEditObj.onSaveAsNew();
                        },
                    },
                    {
                        name  : 'cancel',
                        label : 'Cancel',
                        action: (e: any) => {
                            e.preventDefault();
                            $RvW.songEditObj.onCancel();
                        },
                    }
                ],
            }
        });

        panel.on('visibleChange', function (e: any) {
            showSongEditPanel.set(e.newVal);
        });

        setPanel(panel);
    }, []);

    // panel visibility
    useEffect(() => {
        if (open) {
            panel?.show();
        } else {
            panel?.hide();
        }
    }, [open]);

    const modal = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // @ts-ignore
        // $(modal.current).modal();

        setTimeout(() => {
            // @ts-ignore
            $(modal.current).modal('setting', 'transition', 'scale').modal('show');
        }, 5000);
    }, []);

    return (
        <>
            {/*<Modal />*/}

            <div ref={container}>
                <div class="yui3-widget-bd" dangerouslySetInnerHTML={{__html: INNER_HTML}}>
                </div>
            </div>
        </>
    );
}