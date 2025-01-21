import {$RvW} from "@/rvw";
import {console} from "@/platform/adapters/air";
import {remoteEnabled} from "@stores/global";

export class Config {
    constructor() {
        this.save = function() {
            $RvW.rvwPreferences.commit();
        }

        /* Getters and setters */
        this.get_version1 = function () {
            return $RvW.rvwPreferences.get("$.version1", 1);
        };
        this.get_version2 = function () {
            return $RvW.rvwPreferences.get("$.version2", 2);
        };
        this.get_bkgndIndex = function () {
            return $RvW.rvwPreferences.get("$.bkgndIndex", 0);
        };
        this.get_p_topMargin = function () {
            return $RvW.rvwPreferences.get("$.p_topMargin", 50);
        };
        this.get_p_bottomMargin = function () {
            return $RvW.rvwPreferences.get("$.p_bottomMargin", 50);
        };
        this.get_p_leftMargin = function () {
            return $RvW.rvwPreferences.get("$.p_leftMargin", 50);
        };
        this.get_p_rightMargin = function () {
            return $RvW.rvwPreferences.get("$.p_rightMargin", 50);
        };
        this.get_singleVersion = function () {
            return $RvW.rvwPreferences.get("$.singleVersion", false);
        };
        this.get_navDualLanguage = function () {
            return $RvW.rvwPreferences.get("$.navDualLanguage", true);
        };
        this.get_mainConfigEnable = function () {
            return $RvW.rvwPreferences.get("$.mainScreenEnable", true);
        };
        this.get_navFontSize = function () {
            return $RvW.rvwPreferences.get("$.navFontSize", 14);
        };
        this.get_selectedScreenIndex = function () {
            return $RvW.rvwPreferences.get("$.selectedScreenIndex", 1);
        };
        this.get_selectedStageScreenIndex = function () {
            return $RvW.rvwPreferences.get("$.selectedStageScreenIndex", 0);
        };
        this.get_stageConfigEnable = function () {
            return $RvW.rvwPreferences.get("$.stageScreenEnable", false);
        };
        this.get_stageStyleVal = function () {
            return $RvW.rvwPreferences.get("$.stageScreenStyle", 0);
        };
        this.get_p_maxFontSize = function () {
            return $RvW.rvwPreferences.get("$.p_maxFontSize", 80);
        };
        this.get_p_enableTransition = function () {
            return $RvW.rvwPreferences.get("$.p_enableTransition", true);
        };
        this.get_p_enableShadow = function () {
            return $RvW.rvwPreferences.get("$.p_enableShadow", true);
        };
        this.get_p_enableFooter = function () {
            return $RvW.rvwPreferences.get("$.p_enableFooter", true);
        };
        this.get_p_enableStroke = function () {
            return $RvW.rvwPreferences.get("$.p_enableStroke", true);
        };
        this.get_p_showTitle = function () {
            return $RvW.rvwPreferences.get("$.p_enableTitle", false);
        };
        this.get_p_textColor = function () {
            return $RvW.rvwPreferences.get("$.p_textColor", "#FFFFFF");
        };
        this.get_p_textColor2 = function () {
            return $RvW.rvwPreferences.get("$.p_textColor2", "#FFFFFF");
        };
        this.get_p_solidBkgndColor = function () {
            return $RvW.rvwPreferences.get("$.p_solidBkgndColor", "#000000");
        };
        this.get_p_bkgnd_color1 = function () {
            return $RvW.rvwPreferences.get("$.p_bkgnd_color1", "#000000");
        };
        this.get_p_bkgnd_color2 = function () {
            return $RvW.rvwPreferences.get("$.p_bkgnd_color2", "#FFFFFF");
        };
        this.get_p_bkgnd_grad_orient = function () {
            return $RvW.rvwPreferences.get("$.p_bkgnd_grad_orient", 0);
        };
        this.get_p_motion_bkgnd_index = function () {
            return $RvW.rvwPreferences.get("$.p_motion_bkgnd_index", 0);
        };
        this.get_p_bkgnd_type = function () {
            return $RvW.rvwPreferences.get("$.p_bkgnd_type", 3);
        };
        this.get_p_text_orientation = function () {
            return $RvW.rvwPreferences.get("$.p_text_orientation", 0);
        };
        this.get_p_align = function () {
            return $RvW.rvwPreferences.get("$.p_align", "center");
        };
        this.get_version6 = function () {
            return $RvW.rvwPreferences.get("$.version6", 0);
        };
        this.get_showDateTime = function () {
            return $RvW.rvwPreferences.get("$.showDateTime", true);
        };
        this.get_showVVLogo = function () {
            return $RvW.rvwPreferences.get("$.showVVLogo", true);
        };
        this.get_showCustomLogo = function () {
            return $RvW.rvwPreferences.get("$.showCustomLogo", false);
        };
        this.get_logoText1 = function () {
            return $RvW.rvwPreferences.get("$.logoText1", "");
        };
        this.get_logoText2 = function () {
            return $RvW.rvwPreferences.get("$.logoText2", "");
        };
        this.get_logoFilename = function () {
            return $RvW.rvwPreferences.get("$.logoFilename", "");
        };
        this.get_song_text_orientation = function () {
            return $RvW.rvwPreferences.get("$.songTextOrientation", 0);
        };
        this.get_song_primaryOnly = function () {
            return $RvW.rvwPreferences.get("$.songPrimaryOnly", false);
        };
        this.get_svOpacity = function () {
            return $RvW.rvwPreferences.get("$.svOpacity", 0.3);
        };
        this.get_svHeight = function () {
            return $RvW.rvwPreferences.get("$.svHeight", 20);
        };
        this.get_svWindow = function () {
            return $RvW.rvwPreferences.get("$.svWindow", false);
        };
        this.get_svGreenWindow = function () {
            return $RvW.rvwPreferences.get("$.svGreenWindow", true);
        };
        this.get_svPosition = function () {
            return $RvW.rvwPreferences.get("$.svPosition", 0);
        };
        this.get_svMaxFontSize = function () {
            return $RvW.rvwPreferences.get("$.svMaxFontSize", 30);
        };
        this.get_svBcolor = function () {
            return $RvW.rvwPreferences.get("$.svBcolor", '#000000');
        };
        this.get_svFcolor = function () {
            return $RvW.rvwPreferences.get("$.svFcolor", '#FFFFFF');
        };
        this.get_svShowPrimary = function () {
            return $RvW.rvwPreferences.get("$.svShowPrimary", false);
        };
        this.get_svShowSecondary = function () {
            return $RvW.rvwPreferences.get("$.svShowSecondary", false);
        };
        this.get_svTextOutline = function () {
            return $RvW.rvwPreferences.get("$.svTextOutline", true);
        };
        this.get_svTextShadow = function () {
            return $RvW.rvwPreferences.get("$.svTextShadow", false);
        };
        this.get_svShowDate = function () {
            return $RvW.rvwPreferences.get("$.svShowDate", true);
        };
        this.get_svMessage = function () {
            return $RvW.rvwPreferences.get("$.svMessage", "");
        };
        this.get_songDBVersion = function () {
            return $RvW.rvwPreferences.get("$.songDBVersion", 2);
        };
        this.get_bibleDBVersion = function () {
            return $RvW.rvwPreferences.get("$.bibleDBVersion", 2);
        };
        this.get_chordsDBVersion = function () {
            return $RvW.rvwPreferences.get("$.chordsDBVersion", 2);
        };
        this.get_versionNum = function () {
            return $RvW.rvwPreferences.get("$.versionNumber", 7);
        };
        this.get_booknamestyle = function () {
            return $RvW.rvwPreferences.get("$.booknamestyle", 4);
        };
        this.get_listinenglish = function () {
            return $RvW.rvwPreferences.get("$.listinenglish", true);
        };
        this.get_presentationOnTop = function () {
            return $RvW.rvwPreferences.get("$.presentationOnTop", false);
        };
        this.get_transparentEnable = function () {
            return $RvW.rvwPreferences.get("$.transparentEnable", false);
        };
        this.get_show2lines = function () {
            return $RvW.rvwPreferences.get("$.show2lines", false);
        };
        this.get_hideStanzaNumber = function () {
            return $RvW.rvwPreferences.get("$.hideStanzaNumber", false);
        };
        this.get_svAlignLeft = function () {
            return $RvW.rvwPreferences.get("$.svAlignLeft", false);
        };
        this.get_svAlignCenter = function () {
            return $RvW.rvwPreferences.get("$.svAlignCenter", false);
        };
        this.get_svAddTexture = function () {
            return $RvW.rvwPreferences.get("$.svAddTexture", false);
        };
        this.get_svShowHorizontal = function () {
            return $RvW.rvwPreferences.get("$.svShowHorizontal", false);
        };
        this.get_pformat_multiplelines = function () {
            return $RvW.rvwPreferences.get("$.p_format_multiplelines", true);
        };
        this.get_myhostname = function () {
            return $RvW.rvwPreferences.get("$.myhostname", "localhost");
        };

        this.set_version1 = function (aH) {
            $RvW.rvwPreferences.set("$.version1", aH);
        };
        this.set_version2 = function (aH) {
            $RvW.rvwPreferences.set("$.version2", aH);
        };
        this.set_bkgndIndex = function (aH) {
            $RvW.rvwPreferences.set("$.bkgndIndex", aH);
        };
        this.set_p_topMargin = function (aH) {
            $RvW.rvwPreferences.set("$.p_topMargin", aH);
        };
        this.set_p_bottomMargin = function (aH) {
            $RvW.rvwPreferences.set("$.p_bottomMargin", aH);
        };
        this.set_p_leftMargin = function (aH) {
            $RvW.rvwPreferences.set("$.p_leftMargin", aH);
        };
        this.set_p_rightMargin = function (aH) {
            $RvW.rvwPreferences.set("$.p_rightMargin", aH);
        };
        this.set_singleVersion = function (aH) {
            $RvW.rvwPreferences.set("$.singleVersion", aH);
        };
        this.set_navDualLanguage = function (aH) {
            $RvW.rvwPreferences.set("$.navDualLanguage", aH);
        };
        this.set_mainConfigEnable = function (aH) {
            $RvW.rvwPreferences.set("$.mainScreenEnable", aH);
        };
        this.set_navFontSize = function (aH) {
            $RvW.rvwPreferences.set("$.navFontSize", aH);
        };
        this.set_selectedScreenIndex = function (aH) {
            $RvW.rvwPreferences.set("$.selectedScreenIndex", aH);
        };
        this.set_selectedStageScreenIndex = function (aH) {
            $RvW.rvwPreferences.set("$.selectedStageScreenIndex", aH);
        };
        this.set_stageConfigEnable = function (aH) {
            $RvW.rvwPreferences.set("$.stageScreenEnable", aH);
        };
        this.set_stageStyleVal = function (aH) {
            $RvW.rvwPreferences.set("$.stageScreenStyle", aH);
        };
        this.set_p_maxFontSize = function (aH) {
            $RvW.rvwPreferences.set("$.p_maxFontSize", aH);
        };
        this.set_p_enableTransition = function (aH) {
            $RvW.rvwPreferences.set("$.p_enableTransition", aH);
        };
        this.set_p_enableShadow = function (aH) {
            $RvW.rvwPreferences.set("$.p_enableShadow", aH);
        };
        this.set_p_enableFooter = function (aH) {
            $RvW.rvwPreferences.set("$.p_enableFooter", aH);
        };
        this.set_p_enableStroke = function (aH) {
            $RvW.rvwPreferences.set("$.p_enableStroke", aH);
        }
        this.set_p_showTitle = function (aH) {
            $RvW.rvwPreferences.set("$.p_enableTitle", aH);
        };
        this.set_p_textColor = function (aH) {
            $RvW.rvwPreferences.set("$.p_textColor", aH);
        };
        this.set_p_textColor2 = function (aH) {
            $RvW.rvwPreferences.set("$.p_textColor2", aH);
        };
        this.set_p_solidBkgndColor = function (aH) {
            $RvW.rvwPreferences.set("$.p_solidBkgndColor", aH);
        };
        this.set_p_bkgnd_color1 = function (aH) {
            $RvW.rvwPreferences.set("$.p_bkgnd_color1", aH);
        };
        this.set_p_bkgnd_color2 = function (aH) {
            $RvW.rvwPreferences.set("$.p_bkgnd_color2", aH);
        };
        this.set_p_bkgnd_grad_orient = function (aH) {
            $RvW.rvwPreferences.set("$.p_bkgnd_grad_orient", aH);
        };
        this.set_p_motion_bkgnd_index = function (aH) {
            $RvW.rvwPreferences.set("$.p_motion_bkgnd_index", aH);
        };
        this.set_p_bkgnd_type = function (aH) {
            $RvW.rvwPreferences.set("$.p_bkgnd_type", aH);
        };
        this.set_p_text_orientation = function (aH) {
            $RvW.rvwPreferences.set("$.p_text_orientation", aH);
        };
        this.set_p_align = function (aH) {
            $RvW.rvwPreferences.set("$.p_align", aH);
        };
        this.set_version6 = function (aH) {
            $RvW.rvwPreferences.set("$.version6", aH);
        };
        this.set_showDateTime = function (aH) {
            $RvW.rvwPreferences.set("$.showDateTime", aH);
        };
        this.set_showVVLogo = function (aH) {
            $RvW.rvwPreferences.set("$.showVVLogo", aH);
        };
        this.set_showCustomLogo = function (aH) {
            $RvW.rvwPreferences.set("$.showCustomLogo", aH);
        };
        this.set_logoText1 = function (aH) {
            $RvW.rvwPreferences.set("$.logoText1", aH);
        };
        this.set_logoText2 = function (aH) {
            $RvW.rvwPreferences.set("$.logoText2", aH);
        };
        this.set_logoFilename = function (aH) {
            $RvW.rvwPreferences.set("$.logoFilename", aH);
        };
        this.set_song_text_orientation = function (aH) {
            $RvW.rvwPreferences.set("$.songTextOrientation", aH);
        };
        this.set_song_primaryOnly = function (aH) {
            $RvW.rvwPreferences.set("$.songPrimaryOnly", aH);
        };
        this.set_svOpacity = function (aH) {
            $RvW.rvwPreferences.set("$.svOpacity", aH);
        };
        this.set_svHeight = function (aH) {
            $RvW.rvwPreferences.set("$.svHeight", aH);
        };
        this.set_svWindow = function (aH) {
            $RvW.rvwPreferences.set("$.svWindow", aH);
        };
        this.set_svGreenWindow = function (aH) {
            $RvW.rvwPreferences.set("$.svGreenWindow", aH);
        };
        this.set_svPosition = function (aH) {
            $RvW.rvwPreferences.set("$.svPosition", aH);
        };
        this.set_svMaxFontSize = function (aH) {
            $RvW.rvwPreferences.set("$.svMaxFontSize", aH);
        };
        this.set_svBcolor = function (aH) {
            $RvW.rvwPreferences.set("$.svBcolor", aH);
        };
        this.set_svFcolor = function (aH) {
            $RvW.rvwPreferences.set("$.svFcolor", aH);
        };
        this.set_svShowPrimary = function (aH) {
            $RvW.rvwPreferences.set("$.svShowPrimary", aH);
        };
        this.set_svShowSecondary = function (aH) {
            $RvW.rvwPreferences.set("$.svShowSecondary", aH);
        };
        this.set_svTextOutline = function (aH) {
            $RvW.rvwPreferences.set("$.svTextOutline", aH);
        };
        this.set_svTextShadow = function (aH) {
            $RvW.rvwPreferences.set("$.svTextShadow", aH);
        };
        this.set_svShowDate = function (aH) {
            $RvW.rvwPreferences.set("$.svShowDate", aH);
        };
        this.set_svMessage = function (aH) {
            $RvW.rvwPreferences.set("$.svMessage", aH);
        };
        this.set_songDBVersion = function (aH) {
            $RvW.rvwPreferences.set("$.songDBVersion", aH);
        };
        this.set_bibleDBVersion = function (aH) {
            $RvW.rvwPreferences.set("$.bibleDBVersion", aH);
        };
        this.set_chordsDBVersion = function (aH) {
            $RvW.rvwPreferences.set("$.chordsDBVersion", aH);
        };
        this.set_versionNum = function (aH) {
            $RvW.rvwPreferences.set("$.versionNumber", aH);
        };
        this.set_booknamestyle = function (aH) {
            $RvW.rvwPreferences.set("$.booknamestyle", aH);
        };
        this.set_listinenglish = function (aH) {
            $RvW.rvwPreferences.set("$.listinenglish", aH);
        };
        this.set_presentationOnTop = function (aH) {
            $RvW.rvwPreferences.set("$.presentationOnTop", aH);
        };
        this.set_transparentEnable = function (aH) {
            $RvW.rvwPreferences.set("$.transparentEnable", aH);
        };
        this.set_show2lines = function (aH) {
            $RvW.rvwPreferences.set("$.show2lines", aH);
        };
        this.set_hideStanzaNumber = function (aH) {
            $RvW.rvwPreferences.set("$.hideStanzaNumber", aH);
        };
        this.set_svAlignLeft = function (aH) {
            $RvW.rvwPreferences.set("$.svAlignLeft", aH);
        };
        this.set_svAlignCenter = function (aH) {
            $RvW.rvwPreferences.set("$.svAlignCenter", aH);
        };
        this.set_svAddTexture = function (aH) {
            $RvW.rvwPreferences.set("$.svAddTexture", aH);
        };
        this.set_svShowHorizontal = function (aH) {
            $RvW.rvwPreferences.set("$.svShowHorizontal", aH);
        };
        this.set_pformat_multiplelines = function (aH) {
            $RvW.rvwPreferences.set("$.p_format_multiplelines", aH);
        };
        this.set_myhostname = function (aH) {
            $RvW.rvwPreferences.set("$.myhostname", aH);
        };
    }
}

export function configInit() {
    const zzz = $RvW.rvwPreferences.get("app.settings.remote.enabled", false);
    remoteEnabled.set(zzz);
    remoteEnabled.subscribe((v) => $RvW.rvwPreferences.set("app.settings.remote.enabled", v));
}