import iv_icons from './iv_icons.js';
const { registerBlockType }     = wp.blocks;
const { __ }                    = wp.i18n;
const {
	TextControl,
	ToggleControl,
} = wp.components;
const {
	RichText,
	InspectorControls,
} = wp.blockEditor;

function YouTubeGetID(url){
  var ID = '';
  url = url.replace(/(>|<)/gi,'').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
  if(url[2] !== undefined) {
    ID = url[2].split(/[^0-9a-z_\-]/i);
    ID = ID[0];
  }
  else {
    ID = url;
  }
    return ID;
}

registerBlockType( 'iv/block', {
	title:                      __('IV video', 'iv'),
    description:                __(
        'Adds video with video comments.',
        'iv'
    ),
	category:                   'embed',
    icon:                       iv_icons.iv_black,
    keywords: [
        __('Interactive Video', 'iv'),
        __('Video Comments', 'iv'),
        __('IV', 'iv')
    ],
    supports: {
        html:                   false,
        anchor:                 true,
    },
	attributes: {
        vidurl: {
			type: 'string',
		},
		preloadc: {
			type: 'boolean',
            default: true,
		},
		lazyloadv: {
			type: 'boolean',
            default: true,
		},
        videoid: {
            type:'string',
        },
        anchor: {
            type:'string',
        },
	},

	edit( { attributes, setAttributes } ) {
 		const { vidurl, preloadc, lazyloadv, videoid, anchor } = attributes;
        
        // Define anchor if it doesn't exist
        if (typeof anchor == 'undefined') setAttributes({anchor:'iv_'+Math.random().toString(36).substring(2, 6)});
		
        return (
			<React.Fragment>
				<InspectorControls>

					<TextControl
						label="Video URL"
						help="youtube.com/v=..."
						value={ vidurl }
						onChange={ (val)=>{ 
                            setAttributes({vidurl:val});
                            setAttributes({videoid: YouTubeGetID(val)} );
                        }}
					/>

					<ToggleControl
						label={ __('Preload comments', 'iv') }
						checked={ preloadc }
						onChange={ (val)=>{setAttributes({preloadc:val})} }
					/>

					<ToggleControl
						label={ __('Lazyload video', 'iv') }
						checked={ lazyloadv }
						onChange={ (val)=>{setAttributes({lazyloadv:val})} }
					/>

				</InspectorControls>
            
                <div>
                    <h2>VC video</h2>
                    <ul>
                        <li>Video URL: { vidurl }</li>
                        <li>Video ID: { videoid }</li>
                        <li>Anchor: { anchor }</li>
                        <li>Lazyloadc: { String(preloadc) }</li>
                        <li>Lazyloadv: { String(lazyloadv) }</li>
                    </ul>
                </div>
			</React.Fragment>
		);
	},

	save( { attributes } ) {
		const { videoid, anchor, preloadc, lazyloadv } = attributes;
        let argstr = '';
        if (anchor) argstr += ' embedid="'+anchor+'"';
        if (typeof lazyloadv !== 'undefined') argstr += ' lazyloadv="'+lazyloadv+'"';
        if (typeof preloadc !== 'undefined') argstr += ' preloadc="'+preloadc+'"';
		return (
            '[ivvideo videoid="'+videoid+'"'+argstr+']'
// 			<div>
// 				<h2>Inspector Control Fields</h2>
// 				<ul>
//                     <li>Video ID: { vidurl }</li>
//                     <li>Lazyloadc: { String(preloadc) }</li>
//                     <li>Lazyloadv: { String(preloadc) }</li>
//                 </ul>
// 			</div>
		);
	},
} ); 