import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'
import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import { CodeEditor } from '@/ui-component/editor/CodeEditor'

const overrideConfig = `{
    overrideConfig: {
        vars: {
            var1: 'abc'
        }
    }
}`

const HowToUseVariablesDialog = ({ show, onCancel }) => {
    const portalElement = document.getElementById('portal')

    const component = show ? (
        <Dialog
            onClose={onCancel}
            open={show}
            fullWidth
            maxWidth='sm'
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
        >
            <DialogTitle sx={{ fontSize: '1rem' }} id='alert-dialog-title'>
                如何使用变量
            </DialogTitle>
            <DialogContent>
                <p style={{ marginBottom: '10px' }}>变量可以在自定义工具、自定义函数、自定义加载器和带有$前缀的If-Else函数中使用。</p>
                <CodeEditor
                    disabled={true}
                    value={`$vars.<variable-name>`}
                    height={'50px'}
                    theme={'dark'}
                    lang={'js'}
                    basicSetup={{ highlightActiveLine: false, highlightActiveLineGutter: false }}
                />
                <p style={{ marginBottom: '10px' }}>变量也可以在任何节点的文本字段参数中使用。例如，在Agent的系统消息中：</p>
                <CodeEditor
                    disabled={true}
                    value={`You are a {{$vars.personality}} AI assistant`}
                    height={'50px'}
                    theme={'dark'}
                    lang={'js'}
                    basicSetup={{ highlightActiveLine: false, highlightActiveLineGutter: false }}
                />
                <p style={{ marginBottom: '10px' }}>如果变量为静态类型，则将按原样取值。如果变量是运行时类型，则将从.env文件中取值。</p>
                <p style={{ marginBottom: '10px' }}>
                    您还可以使用<b>vars</b>覆盖API overrideConfig中的变量值：
                </p>
                <CodeEditor
                    disabled={true}
                    value={overrideConfig}
                    height={'170px'}
                    theme={'dark'}
                    lang={'js'}
                    basicSetup={{ highlightActiveLine: false, highlightActiveLineGutter: false }}
                />
                <p>
                    Read more from{' '}
                    <a target='_blank' rel='noreferrer' href='https://docs.flowiseai.com/using-flowise/variables'>
                        docs
                    </a>
                </p>
            </DialogContent>
        </Dialog>
    ) : null

    return createPortal(component, portalElement)
}

HowToUseVariablesDialog.propTypes = {
    show: PropTypes.bool,
    onCancel: PropTypes.func
}

export default HowToUseVariablesDialog
