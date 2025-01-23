
export interface PresentationConfig {
    /**
     * List of primary slides (html)
     * */
    p_text1_arr: string[];
    /**
     * List of secondary slides (html)
     * */
    p_text2_arr: string[];
    /**
     * Primary text font
     * */
    p_text1_font: string;
    /**
     * Secondary text font
     * */
    p_text2_font: string;
    /**
     * Title text
     * */
    p_title?: string;
    /**
     * Footnote text
     * */
    p_footnote?: string;
    /**
     * Current index
     * */
    p_current_index: number;
    /**
     * Last index
     * */
    p_last_index: number;
    /**
     * Background image filenames
     * */
    p_bkgnd_filename: string[];
    /**
     * Enable background motion (zoom/pan)
     * */
    p_bkgnd_motion: boolean;
    /**
     * Text color in hex (primary)
     * */
    p_font_color: string;
    /**
     * Text color in hex (secondary)
     * */
    p_font_color2: string;
    /**
     * Inverted text color in hex (primary)
     * */
    p_font_color_invert: string;
    /**
     * Inverted text color in hex (secondary)
     * */
    p_font_color2_invert: string;
    /**
     * Window width
     * */
    p_window_X: number;
    /**
     * Window height
     * */
    p_window_Y: number;
    /**
     * Top margin
     * */
    p_topMargin: number;
    /**
     * Bottom margin
     * */
    p_bottomMargin: number;
    /**
     * Left margin
     * */
    p_leftMargin: number;
    /**
     * Right margin
     * */
    p_rightMargin: number;
    /**
     * Text alignment
     * */
    p_align: 'left' | 'center' | 'right';
    /**
     * Enable touch gestures
     * */
    p_enableGestures: boolean;
    /**
     * Text orientation
     * */
    p_text_orientation: number;
    /**
     * Maximum font size
     * */
    p_maxFontSize: number;
    /**
     * Enable transition
     * */
    p_enableTransition: boolean;
    /**
     * Transition duration
     * */
    p_transitionDuration: number;
    /**
     * Enable shadow
     * */
    p_enableShadow: boolean;
    /**
     * Enable stroke
     * */
    p_enableStroke: boolean;
    /**
     * Enable stroke
     * */
    p_enableFooter: boolean;
    /**
     * Background color in hex
     * */
    p_bkgnd_color: string;
    /**
     * Background color 1 in rgb (gradient)
     * */
    p_bkgnd_color1: string;
    /**
     * Background color 2 in rgb (gradient)
     * */
    p_bkgnd_color2: string;
    /**
     * Background gradient orientation (angle)
     * */
    p_bkgnd_grad_orient: number;
    /**
     * Background type
     * */
    p_bkgnd_type: 1 | 2 | 3;
    /**
     * Show Branding Text
     * */
    p_showBranding: boolean;
    /**
     * Logo text
     * */
    p_brandingText: string;
    /**
     * Show title
     * */
    p_showTitle: boolean;
    /**
     * Show date
     * */
    p_showDate: boolean;
    /**
     * Shade background
     * */
    p_shadeBackground: boolean;
    /**
     * Transparent background
     * */
    p_transparentBackground: boolean;
    /**
     * Is Arabic (primary)
     * */
    p_isArabic1: boolean;
    /**
     * Is Arabic (secondary)
     * */
    p_isArabic2: boolean;
    /**
     * Verse 1 scale factor (primary)
     * */
    p_ver1ScaleFactor: number;
    /**
     * Verse 2 scale factor (secondary)
     * */
    p_ver2ScaleFactor: number;
    /**
     * Format multiple lines
     * */
    p_format_multiplelines: boolean;
}