import PropTypes from 'prop-types';

import ChooseLanguageComponent from './choose.language.component';
import ChooseContentTypeComponent from './choose.content.type.component';

import './css/create.component.css';

const CreateComponent = (props) => {
    return (
        <div className="c-create" style={{maxHeight:`${props.maxHeight}px`}}>
            <ChooseLanguageComponent {...props} />
            <ChooseContentTypeComponent {...props} />
        </div>
    );
}

CreateComponent.propTypes = {
    maxHeight: PropTypes.number.isRequired,
    labels: PropTypes.object.isRequired,
    languages: PropTypes.object.isRequired,
    contentTypes: PropTypes.object.isRequired,
    onLanguageSelected: PropTypes.func.isRequired,
    onContentTypeSelected: PropTypes.func.isRequired,
    forcedLanguage: PropTypes.string.isRequired,
    allowedLanguages: PropTypes.array.isRequired,
    preselectedContentType: PropTypes.string.isRequired,
    allowedContentTypes: PropTypes.array.isRequired,
    preselectedLanguage: PropTypes.sttring.isRequired
};

export default CreateComponent;
