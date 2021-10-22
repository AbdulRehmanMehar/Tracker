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
Add-Type -AssemblyName System.Windows.Forms
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
        $FileRecordArray=@()

        # get mouse position
        $X = [System.Windows.Forms.Cursor]::Position.X
        $Y = [System.Windows.Forms.Cursor]::Position.Y

        $ActiveHandle = [UserWindows]::GetForegroundWindow()
        $Process = Get-Process | ? {$_.MainWindowHandle -eq $activeHandle}
        # Write-Output 'Process name:' $Process.ProcessName

        $ProcessName = $Process.ProcessName
        $ProcessTitle = $Process.MainWindowTitle
        $ProcessPath = $Process | Select-Object -ExpandProperty Path | Out-String
        $ProcessIcon = [System.Drawing.Icon]::ExtractAssociatedIcon($ProcessPath)
        $MemoryStream = New-Object System.IO.MemoryStream
        $ProcessIcon.save($MemoryStream)
        $Bytes = $MemoryStream.ToArray()
        $MemoryStream.Flush()
        $MemoryStream.Dispose()
        $ProcessIcon = [convert]::ToBase64String($Bytes)

        #$ProcessPath = "" 

        #($Process | Select ProcessName, @{Name="AppTitle";Expression= {($_.MainWindowTitle)}} ) | foreach {$_.ProcessName + ',' + [regex]::match($_.AppTitle,'[\w-.]*\.[a-zA-Z0-9]*').Groups[0].Value}
        
        $FileName = [regex]::match($Process.MainWindowTitle,'[\w-.]*\.[a-zA-Z0-9]+').Groups[0].Value
        
        #Write-Output $ProcessName

        #if($FileName) {
            $Status="Success"
            #Write-Output "Process: "
            #Write-Output $Process.Name

            $FileRecord = (& 'handle.exe' -p $Process.Id -a | Select-String File) 2>&1
         
            $FileRecord = $FileRecord | Out-String
            $FileRecord = $FileRecord.Replace(":", "").Replace("\", "/")
            $FileRecordArray = $FileRecord.Split([Environment]::NewLine) 
         #   $FileRecordArray = @($FileRecordArray | % { $_.ToString() })
            if($FileRecord) {

                #$FilePath = [regex]::matches($FileRecord, '[a-zA-Z0-9:\\_.]+').Groups[2].Value

                #if($FilePath) {
                 #   Write-Output "File path: "
                  #  Write-Output $FilePath
                #} else {
                #    $ErrorMessage="Can't find path for that file"
                #}
                $FilePath = $FileRecord
            } else {
                $ErrorMessage="Can't find that file record in proccess locks"
            }
        #} else {
            $ErrorMessage="Process doesn't have any active files"
        #}

        Write-Output "{`"Status`": `"$Status`", `"ProcessName`": `"$ProcessName`", `"ProcessTitle`": `"$ProcessTitle`", `"FilePath`": `"$FileRecordArray`", `"FileName`": `"$FileName`", `"Error`": `"$ErrorMessage`", `"MouseX`": `"$X`", `"MouseY`": `"$Y`", `"ProcessIcon`": `"$ProcessIcon`"}"
    } catch {
        $ErrorMessage="Failed to get active Window details. More Info: $_"
    }
# }