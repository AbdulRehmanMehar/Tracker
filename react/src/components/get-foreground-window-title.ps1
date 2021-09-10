<#
    .Synopsis
        Gets active window in a user session
    .Description
        Gets active window in a user session. It displays the process name and window title of the process
    .Example
        .\Get-ActiveWindow.ps1
        Description
        -----------
        Gets the active window that is currently highlighted.
    .Notes
        AUTHOR:    Sitaram Pamarthi
        Website:   http://techibee.com
#>
[CmdletBinding()]
Param(
)
Add-Type @"
  using System;
  using System.Runtime.InteropServices;
  public class UserWindows {
    [DllImport("user32.dll")]
    public static extern IntPtr GetForegroundWindow();
}
"@
# while($True) {
    try {
        $OutputEncoding = New-Object -typename System.Text.UTF8Encoding
        [Console]::OutputEncoding = New-Object -typename System.Text.UTF8Encoding

        $ErrorMessage=""
        $Status="Failed"
        $FileName=""
        $FilePath=""
        $ProcessName=""
        $ProcessTitle=""

        $ActiveHandle = [UserWindows]::GetForegroundWindow()
        $Process = Get-Process | ? {$_.MainWindowHandle -eq $activeHandle}
        # Write-Output 'Process name:' $Process.ProcessName

        $ProcessName = $Process.ProcessName
        $ProcessTitle = $Process.MainWindowTitle

        #($Process | Select ProcessName, @{Name="AppTitle";Expression= {($_.MainWindowTitle)}} ) | foreach {$_.ProcessName + ',' + [regex]::match($_.AppTitle,'[\w-.]*\.[a-zA-Z0-9]*').Groups[0].Value}
        
        $FileName = [regex]::match($Process.MainWindowTitle,'[\w-.]*\.[a-zA-Z0-9]+').Groups[0].Value
        
        
        if($FileName) {
            $Status="Success"
            # Write-Output "Filename: "
            # Write-Output $Filename

            $FileRecord = (.\handle.exe -p $Process.ID -nobanner | Where-Object { $_ -Match $Filename })

            if($FileRecord) {
                # Write-Output "File record: "
                # Write-Output $FileRecord

                $FilePath = [regex]::matches($FileRecord, '[a-zA-Z0-9:\\_.]+').Groups[2].Value

                if($FilePath) {
                    # Write-Output "File path: "
                    # Write-Output $FilePath
                } else {
                    $ErrorMessage="Can't find path for that file"
                }
            } else {
                $ErrorMessage="Can't find that file record in proccess locks"
            }
        } else {
            $ErrorMessage="Process doesn't have any active files"
        }

        Write-Output "{'Status': '$Status', 'ProcessName': '$ProcessName', 'ProcessTitle': '$ProcessTitle', FilePath': '$FilePath', 'FileName': '$FileName', 'Error': '$ErrorMessage'}"
    } catch {
        $ErrorMessage="Failed to get active Window details. More Info: $_"
    }
# }