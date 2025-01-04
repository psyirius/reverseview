export default function RightNotesTab() {
    return (
        <div class="flex flex-col h-full w-full overflow-hidden overflow-y-auto">
            <div class="flex-[0]">
                <div class="generalheading2">Bible Notes Manager</div>

                <table style={{border: 0}}>
                    <tbody>
                    <tr style={{height: '100px'}}>
                        <td>
                            <div class="bibleMngContainerLeft">
                                <b>Notes File</b>
                                <br/>
                                <input type="button" id="nm_newID" data-tooltip="Create new Notes file"
                                       value=" NEW "/> |
                                <input type="button" id="nm_add_buttonID" data-tooltip="Load Notes file"
                                       value=" LOAD "/>
                                <br/>
                                <br/>
                                <b>Select Notes</b>
                                <br/>
                                <select id="nm_selectID" class="selectboxStyle">
                                    <option value="1">Default Notes</option>
                                </select>
                                <br/>
                                <input type="button" id="nm_sel_buttonID"
                                       data-tooltip="Select this Notes file as active" value=" SELECT "/> |
                                <input type="button" id="nm_deleteID" data-tooltip="Delete this Notes file"
                                       value=" DELETE "/> |
                                <input type="button" id="nm_save_file_buttonID"
                                       data-tooltip="Save the Notes file to Desktop" value=" SAVE "/>
                                <br/>
                                <br/>
                                <b>Notes Type</b>
                                <input type="radio" name="nm_note_type" id="nm_note_type1" value="1"
                                       checked/>Chapter&nbsp;&nbsp;
                                <input type="radio" name="nm_note_type" id="nm_note_type2" value="2"/>Topic&nbsp;&nbsp;
                                <br/>
                                <br/>
                            </div>
                        </td>

                        <td>
                            {/* TODO: make it a dialog */}
                            <div id="nm_new_promptID" class="bibleMngContainerRight">
                                <b>Name</b>
                                <br/>
                                <input type="text" id="nm_name_promptID" size={25}/>
                                <br/>
                                <b>Description</b>
                                <br/>
                                <textarea id="nm_description_promptID" rows={4} cols={25}></textarea>
                                <input type="button" id="nm_save_promptID" data-tooltip="Initialize new Notes file"
                                       value=" SAVE "/> |
                                <input type="button" id="nm_cancel_promptID"
                                       data-tooltip="Cancel creating new Notes file" value=" CANCEL "/>
                            </div>

                            <div id="nm_sel_dataID" class="bibleMngContainerRight">
                                <b>Name</b>
                                <br/>
                                <div id="nm_nameID" class="nm_text"></div>
                                <br/>
                                <b>Description</b>
                                <br/>
                                <div id="nm_descriptionID" class="nm_text"></div>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>

                <div class="generalheading2">Notes</div>
            </div>

            <div class="flex-1 overflow-y-auto h-full w-full relative">
                <div
                    id="notesResultsID"
                    class="absolute h-full w-full m-0 p-0 overflow-hidden overflow-y-auto"
                    style={{
                        border: '1px solid #d4d4d5',
                        borderRadius: '0.28571429rem',
                    }}
                >
                    {/* Content */}
                </div>
            </div>
        </div>
    )
}