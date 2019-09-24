
import PropTypes               from 'prop-types';
import React                   from 'react';
import { init }                from 'onfido-sdk-ui';
import { get as getLanguage }  from '_common/language';
import {
    Expired,
    Verified,
    Unverified,
    UploadComplete,
    Unsuported,
}                              from './proof-of-identity-messages.jsx';
import { onfido_status_codes } from './proof-of-identity';

const onfido_container_id = 'onfido';
const OnfidoContainer = () => <div style={{ marginTop: '20px' }}><div id={onfido_container_id} /></div>;

class Onfido extends React.Component {
    state = {
        onfido           : null,
        onfido_init_error: false,
    }

    initOnfido = async () => {
        try {
            const onfido = init({
                containerId: onfido_container_id,
                language   : {
                    locale: getLanguage().toLowerCase() || 'en',
                },
                token     : this.props.onfido_service_token,
                useModal  : false,
                onComplete: this.handleComplete,
                steps     : [
                    'document',
                    'face',
                ],
            });
            this.setState({ onfido });
        } catch (err) {
            this.setState({ onfido_init_error: true });
        }
    };

    handleComplete = () => {
        this.state.onfido.tearDown();
        this.props.handleComplete();
    }

    componentDidMount() {
        if (this.props.status === onfido_status_codes.onfido) {
            this.initOnfido(this.props.onfido_service_token);
        }
    }

    componentWillUnmount() {
        if (this.state.onfido) {
            this.state.onfido.tearDown();
        }
    }

    render() {
        const { status, has_poa } = this.props;

        if (status === onfido_status_codes.onfido) return <OnfidoContainer />;

        switch (status) {
            case onfido_status_codes.unsupported:
                return <Unsuported />;
            case onfido_status_codes.pending:
                return <UploadComplete has_poa={has_poa} />;
            case onfido_status_codes.rejected:
                return <Unverified />;
            case onfido_status_codes.verified:
                return <Verified has_poa={has_poa} />;
            case onfido_status_codes.expired:
                return <Expired />;
            case onfido_status_codes.suspected:
                return <Unverified />;
            default:
                return null;
        }
    }
}

Onfido.propTypes = {
    handleComplete      : PropTypes.func,
    has_poa             : PropTypes.bool,
    onfido_service_token: PropTypes.string,
    status              : PropTypes.oneOf(Object.keys(onfido_status_codes)),
};

export default Onfido;
