import { createPortal } from 'react-dom'
import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Dialog, DialogContent, DialogTitle, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material'
import moment from 'moment'
import axios from 'axios'
import { baseURL } from '@/store/constant'

const AboutDialog = ({ show, onCancel }) => {
    const portalElement = document.getElementById('portal')

    const [data, setData] = useState({})

    useEffect(() => {
        if (show) {
            const username = localStorage.getItem('username')
            const password = localStorage.getItem('password')

            const config = {}
            if (username && password) {
                config.auth = {
                    username,
                    password
                }
                config.headers = {
                    'Content-type': 'application/json',
                    'x-request-from': 'internal'
                }
            }
            const latestReleaseReq = axios.get('https://api.github.com/repos/FlowiseAI/Flowise/releases/latest')
            const currentVersionReq = axios.get(`${baseURL}/api/v1/version`, { ...config })

            Promise.all([latestReleaseReq, currentVersionReq])
                .then(([latestReleaseData, currentVersionData]) => {
                    const finalData = {
                        ...latestReleaseData.data,
                        currentVersion: currentVersionData.data.version
                    }
                    setData(finalData)
                })
                .catch((error) => {
                    console.error('Error fetching data:', error)
                })
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show])

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
                版本
            </DialogTitle>
            <DialogContent>
                {data && (
                    <Table aria-label='simple table'>
                        <TableHead>
                            <TableRow>
                                <TableCell>当前版本</TableCell>
                                <TableCell>最新版本</TableCell>
                                <TableCell>发布时间</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>{data.currentVersion}</TableCell>
                                <TableCell>
                                    <a target='_blank' rel='noreferrer' href={data.html_url}>
                                        {data.name}
                                    </a>
                                </TableCell>
                                <TableCell>{moment(data.published_at).fromNow()}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                )}
            </DialogContent>
        </Dialog>
    ) : null

    return createPortal(component, portalElement)
}

AboutDialog.propTypes = {
    show: PropTypes.bool,
    onCancel: PropTypes.func
}

export default AboutDialog
